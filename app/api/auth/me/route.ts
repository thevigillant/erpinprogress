import { NextRequest, NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const user = await validateToken(token);

    if (!user) {
      const response = NextResponse.json(
        { error: "Sessão expirada" },
        { status: 401 }
      );
      response.cookies.set("auth-token", "", {
        httpOnly: true,
        maxAge: 0,
        path: "/",
      });
      return response;
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Erro ao verificar sessão:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
