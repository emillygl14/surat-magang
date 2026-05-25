const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createPengajuan = async (req, res) => {
  try {
    const {
      jenisSurat,
      namaPerusahaan,
      alamatPerusahaan,
      tanggalMulai,
      tanggalSelesai,
      keperluan,
    } = req.body;

    if (
      !jenisSurat ||
      !namaPerusahaan ||
      !alamatPerusahaan ||
      !tanggalMulai ||
      !tanggalSelesai ||
      !keperluan
    ) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const filePendukung = req.file ? `/uploads/${req.file.filename}` : null;

    // Validasi Pengajuan Aktif & Duplikat
    const existingPengajuan = await prisma.pengajuan.findMany({
      where: { userId: req.user.id },
    });

    const activePengajuan = existingPengajuan.find(p => ["PENDING", "PROSES"].includes(p.status));
    if (activePengajuan) {
      return res.status(400).json({ message: "Anda masih memiliki pengajuan aktif yang sedang menunggu atau diproses." });
    }

    const duplicatePengajuan = existingPengajuan.find(
      p => p.namaPerusahaan.toLowerCase() === namaPerusahaan.toLowerCase() && p.jenisSurat === jenisSurat
    );
    if (duplicatePengajuan) {
      return res.status(400).json({ message: "Anda sudah pernah mengajukan surat ini untuk perusahaan tersebut." });
    }

    const pengajuan = await prisma.pengajuan.create({
      data: {
        userId: req.user.id,
        jenisSurat,
        namaPerusahaan,
        alamatPerusahaan,
        tanggalMulai: new Date(tanggalMulai),
        tanggalSelesai: new Date(tanggalSelesai),
        keperluan,
        filePendukung,
      },
    });

    res.status(201).json({ message: "Pengajuan berhasil dikirim", pengajuan });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMyPengajuan = async (req, res) => {
  try {
    const pengajuan = await prisma.pengajuan.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(pengajuan);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllPengajuan = async (req, res) => {
  try {
    const pengajuan = await prisma.pengajuan.findMany({
      include: {
        user: { select: { nama: true, email: true, nim: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(pengajuan);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, catatan, alasanPenolakan } = req.body;

    const validStatuses = ["PENDING", "PROSES", "DITOLAK", "SELESAI"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    const updateData = { 
      status, 
      catatan: catatan || null,
      alasanPenolakan: alasanPenolakan || null 
    };

    if (status === "SELESAI") {
      updateData.tglSelesaiSurat = new Date();
      if (req.file) {
        updateData.fileSelesai = `/uploads/${req.file.filename}`;
      }
    }

    const pengajuan = await prisma.pengajuan.update({
      where: { id },
      data: updateData,
    });

    res.json({ message: "Status berhasil diperbarui", pengajuan });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deletePengajuan = async (req, res) => {
  try {
    const { id } = req.params;
    const pengajuan = await prisma.pengajuan.findUnique({ where: { id } });
    if (!pengajuan) return res.status(404).json({ message: "Tidak ditemukan" });
    if (pengajuan.userId !== req.user.id)
      return res.status(403).json({ message: "Akses ditolak" });
    if (pengajuan.status !== "PENDING")
      return res
        .status(400)
        .json({ message: "Hanya pengajuan PENDING yang bisa dihapus" });

    await prisma.pengajuan.delete({ where: { id } });
    res.json({ message: "Pengajuan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createPengajuan,
  getMyPengajuan,
  getAllPengajuan,
  updateStatus,
  deletePengajuan,
};
