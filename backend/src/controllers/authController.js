const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    const { nama, email, password, nim, role } = req.body;

    if (!nama || !email || !password) {
      return res
        .status(400)
        .json({ message: "Nama, email, dan password wajib diisi" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    if (nim) {
      const nimExist = await prisma.user.findUnique({ where: { nim } });
      if (nimExist)
        return res.status(400).json({ message: "NIM sudah terdaftar" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        nama,
        email,
        password: hashed,
        nim: nim || null,
        role: role === "ADMIN" ? "ADMIN" : "MAHASISWA",
      },
    });

    res.status(201).json({
      message: "Registrasi berhasil",
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { nim, password } = req.body;

    if (!nim || !password) {
      return res.status(400).json({ message: "NIM dan password wajib diisi" });
    }

    // Cari user: coba via NIM dulu, lalu via email
    let user = null;
    if (nim.includes("@")) {
      user = await prisma.user.findUnique({ where: { email: nim } });
    } else {
      user = await prisma.user.findUnique({ where: { nim } });
    }

    if (!user) {
      return res.status(400).json({ message: "NIM atau password salah" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "NIM atau password salah" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, nama: user.nama },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role,
        nim: user.nim,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        nim: true,
        noHp: true,
        programStudi: true,
        fotoProfil: true,
        createdAt: true,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { nama, email, nim, noHp, programStudi, password } = req.body;
    
    let updateData = {
      nama,
      email,
      nim: nim || null,
      noHp: noHp || null,
      programStudi: programStudi || null,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      updateData.fotoProfil = `/uploads/${req.file.filename}`;
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        nama: true,
        email: true,
        role: true,
        nim: true,
        noHp: true,
        programStudi: true,
        fotoProfil: true,
      }
    });

    res.json({ message: "Profil berhasil diperbarui", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { register, login, getProfile, updateProfile };
