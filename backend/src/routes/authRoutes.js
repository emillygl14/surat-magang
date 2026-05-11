const express = require("express");
const {
  register,
  login,
  getProfile,
  updateProfile,
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, upload.single("fotoProfil"), updateProfile);

module.exports = router;
