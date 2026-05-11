-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MAHASISWA', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'DISETUJUI', 'DITOLAK');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MAHASISWA',
    "nim" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pengajuan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jenisSurat" TEXT NOT NULL,
    "namaPerusahaan" TEXT NOT NULL,
    "alamatPerusahaan" TEXT NOT NULL,
    "tanggalMulai" TIMESTAMP(3) NOT NULL,
    "tanggalSelesai" TIMESTAMP(3) NOT NULL,
    "keperluan" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pengajuan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_nim_key" ON "User"("nim");

-- AddForeignKey
ALTER TABLE "Pengajuan" ADD CONSTRAINT "Pengajuan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
