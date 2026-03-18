const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Cria o usuário admin
  const hashedPassword = await bcrypt.hash("admin", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@erp.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@erp.com",
      password: hashedPassword,
      role: "admin",
      active: true,
    },
  });

  console.log(`✅ Usuário admin criado: ${admin.email} (senha: admin)`);
  console.log(`   Role: ${admin.role}`);
  console.log(`   ID: ${admin.id}`);
}

main()
  .catch((e) => {
    console.error("❌ Erro ao fazer seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
