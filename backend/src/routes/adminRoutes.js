const express = require("express");
const {
  getMahasiswa, createMahasiswa, updateMahasiswa, deleteMahasiswa,
  getJenisSurat, createJenisSurat, updateJenisSurat, deleteJenisSurat,
  getSetting, updateSetting,
  getLaporan
} = require("../controllers/adminController");
const { verifyToken, isAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.use(verifyToken, isAdmin);

// Mahasiswa
router.get("/mahasiswa", getMahasiswa);
router.post("/mahasiswa", createMahasiswa);
router.put("/mahasiswa/:id", updateMahasiswa);
router.delete("/mahasiswa/:id", deleteMahasiswa);

// Jenis Surat
router.get("/jenis-surat", getJenisSurat);
router.post("/jenis-surat", createJenisSurat);
router.put("/jenis-surat/:id", updateJenisSurat);
router.delete("/jenis-surat/:id", deleteJenisSurat);

// Setting
router.get("/setting", getSetting);
router.put("/setting", upload.single("logoJurusan"), updateSetting);

// Laporan
router.get("/laporan", getLaporan);

module.exports = router;
