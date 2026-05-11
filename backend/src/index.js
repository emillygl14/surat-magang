const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const pengajuanRoutes = require("./routes/pengajuanRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: true, // true allows the origin of the request
    credentials: true,
  }),
);
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.json({ message: "API Surat Magang berjalan!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/pengajuan", pengajuanRoutes);
app.use("/api/admin", adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Terjadi kesalahan pada server",
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
