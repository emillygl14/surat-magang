const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@kampus.ac.id" },
    update: {},
    create: {
      nama: "Administrator",
      email: "admin@kampus.ac.id",
      password: hashed,
      role: "ADMIN",
    },
  });

  console.log("Admin berhasil dibuat:", admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
