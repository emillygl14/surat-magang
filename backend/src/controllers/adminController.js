const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// MAHASISWA CRUD
const getMahasiswa = async (req, res) => {
  try {
    const mahasiswa = await prisma.user.findMany({
      where: { role: "MAHASISWA" },
      select: {
        id: true,
        nama: true,
        email: true,
        nim: true,
        noHp: true,
        programStudi: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(mahasiswa);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createMahasiswa = async (req, res) => {
  try {
    const { nama, email, nim, password, noHp, programStudi } = req.body;
    if (!nama || !email || !password) {
      return res.status(400).json({ message: "Nama, email, dan password wajib diisi" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email sudah terdaftar" });

    if (nim) {
      const nimExist = await prisma.user.findUnique({ where: { nim } });
      if (nimExist) return res.status(400).json({ message: "NIM sudah terdaftar" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        nama,
        email,
        password: hashed,
        nim: nim || null,
        noHp: noHp || null,
        programStudi: programStudi || null,
        role: "MAHASISWA",
      },
    });

    res.status(201).json({ message: "Mahasiswa berhasil ditambahkan", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateMahasiswa = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, email, nim, password, noHp, programStudi } = req.body;

    let updateData = { nama, email, nim: nim || null, noHp: noHp || null, programStudi: programStudi || null };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    res.json({ message: "Mahasiswa berhasil diperbarui", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteMahasiswa = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.pengajuan.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });
    res.json({ message: "Mahasiswa berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// JENIS SURAT CRUD
const getJenisSurat = async (req, res) => {
  try {
    const jenis = await prisma.jenisSurat.findMany({ orderBy: { createdAt: "desc" } });
    res.json(jenis);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createJenisSurat = async (req, res) => {
  try {
    const { nama } = req.body;
    if (!nama) return res.status(400).json({ message: "Nama jenis surat wajib diisi" });
    const jenis = await prisma.jenisSurat.create({ data: { nama } });
    res.status(201).json({ message: "Jenis surat ditambahkan", jenis });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateJenisSurat = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama } = req.body;
    const jenis = await prisma.jenisSurat.update({ where: { id }, data: { nama } });
    res.json({ message: "Jenis surat diperbarui", jenis });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteJenisSurat = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.jenisSurat.delete({ where: { id } });
    res.json({ message: "Jenis surat dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// SETTING
const getSetting = async (req, res) => {
  try {
    let setting = await prisma.setting.findFirst();
    if (!setting) {
      setting = await prisma.setting.create({ data: {} });
    }
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateSetting = async (req, res) => {
  try {
    const { namaAplikasi, infoKontak } = req.body;
    let setting = await prisma.setting.findFirst();
    
    let updateData = { namaAplikasi, infoKontak };
    if (req.file) {
      updateData.logoJurusan = `/uploads/${req.file.filename}`;
    }

    if (!setting) {
      setting = await prisma.setting.create({ data: updateData });
    } else {
      setting = await prisma.setting.update({ where: { id: setting.id }, data: updateData });
    }

    res.json({ message: "Pengaturan diperbarui", setting });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// LAPORAN
const getLaporan = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    
    let where = {};
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      };
    }
    if (status) {
      where.status = status;
    }

    const pengajuan = await prisma.pengajuan.findMany({
      where,
      include: {
        user: { select: { nama: true, nim: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(pengajuan);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getMahasiswa, createMahasiswa, updateMahasiswa, deleteMahasiswa,
  getJenisSurat, createJenisSurat, updateJenisSurat, deleteJenisSurat,
  getSetting, updateSetting,
  getLaporan
};
