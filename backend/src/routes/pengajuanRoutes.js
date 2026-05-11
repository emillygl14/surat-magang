const express = require("express");
const {
  createPengajuan,
  getMyPengajuan,
  getAllPengajuan,
  updateStatus,
  deletePengajuan,
} = require("../controllers/pengajuanController");
const { verifyToken, isAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// Mahasiswa
router.post("/", verifyToken, upload.single("filePendukung"), createPengajuan);
router.get("/my", verifyToken, getMyPengajuan);
router.delete("/:id", verifyToken, deletePengajuan);

// Admin
router.get("/", verifyToken, isAdmin, getAllPengajuan);
router.patch("/:id/status", verifyToken, isAdmin, updateStatus);

module.exports = router;
