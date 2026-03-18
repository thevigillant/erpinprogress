import { prisma } from "./db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";
const SESSION_DURATION_HOURS = 24;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<{ user: AuthUser; token: string } | null> {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.active) {
    return null;
  }

  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) {
    return null;
  }

  // Cria token JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: `${SESSION_DURATION_HOURS}h` }
  );

  // Salva sessão no banco
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + SESSION_DURATION_HOURS);

  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
    },
    token,
  };
}

export async function validateToken(token: string): Promise<AuthUser | null> {
  try {
    // Verifica JWT
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
    };

    // Verifica se a sessão existe e não expirou
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date() || !session.user.active) {
      return null;
    }

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
      active: session.user.active,
    };
  } catch {
    return null;
  }
}

export async function invalidateToken(token: string): Promise<void> {
  try {
    await prisma.session.delete({ where: { token } });
  } catch {
    // Token pode já ter sido removido
  }
}

export function hasPermission(user: AuthUser, _permission: string): boolean {
  // Admin tem acesso total
  if (user.role === "admin") {
    return true;
  }

  // Aqui você pode expandir com um sistema de permissões granular
  // Por enquanto, admin = tudo
  return false;
}
