const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const pengajuan = await prisma.pengajuan.findMany({
    where: {
      status: "SELESAI",
    },
    select: {
      id: true,
      fileSelesai: true,
    },
  });
  console.log(JSON.stringify(pengajuan, null, 2));
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
