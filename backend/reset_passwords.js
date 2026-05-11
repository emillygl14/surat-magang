const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash("password123", 10);
  
  // Update Admin
  await prisma.user.update({
    where: { email: "admin@kampus.ac.id" },
    data: { password: hashed }
  });
  console.log("Admin password reset to: password123");

  // Update Emilly
  await prisma.user.update({
    where: { email: "emillysem6@gmail.com" },
    data: { password: hashed }
  });
  console.log("Emilly password reset to: password123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
