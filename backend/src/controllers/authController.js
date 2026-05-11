const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

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
    const userId = req.user.id;

    // Build update data dynamically
    const updateData = {};
    if (nama) updateData.nama = nama;
    if (email) updateData.email = email;
    if (nim !== undefined) updateData.nim = nim || null;
    if (noHp !== undefined) updateData.noHp = noHp || null;
    if (programStudi !== undefined)
      updateData.programStudi = programStudi || null;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      updateData.fotoProfil = `/uploads/${req.file.filename}`;
    }

    // Check for unique constraints if email or nim is changed
    if (email || nim) {
      const existing = await prisma.user.findFirst({
        where: {
          OR: [
            email ? { email } : null,
            nim ? { nim } : null,
          ].filter(Boolean),
          NOT: { id: userId },
        },
      });

      if (existing) {
        const field = existing.email === email ? "Email" : "NIM";
        return res.status(400).json({ message: `${field} sudah digunakan oleh akun lain` });
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
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
      },
    });

    console.log("Profile updated successfully for user:", userId);
    res.json({ message: "Profil berhasil diperbarui", user });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      message: "Server error saat memperbarui profil",
      error: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email tidak ditemukan" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000); // 1 jam

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    });

    // Simulasi kirim email
    console.log(`Reset Token for ${email}: ${token}`);
    
    res.json({ message: "Token reset password telah dikirim ke email (Cek console backend)" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Token tidak valid atau sudah kadaluwarsa" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.json({ message: "Password berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { register, login, getProfile, updateProfile, forgotPassword, resetPassword };
