import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

const Field = ({ label, name, type = "text", placeholder, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      required
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

export default function Register() {
  const [form, setForm] = useState({
    nama: "",
    nim: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      return setError("Konfirmasi password tidak cocok");
    }
    if (form.password.length < 6) {
      return setError("Password minimal 6 karakter");
    }
    setLoading(true);
    try {
      await api.post("/auth/register", {
        nama: form.nama,
        nim: form.nim,
        email: form.email,
        password: form.password,
        role: "MAHASISWA",
      });
      navigate("/login", { state: { message: "Registrasi berhasil! Silakan login." } });
    } catch (err) {
      const msg = err.response?.data?.message || "Registrasi gagal";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Daftar Akun</h1>
          <p className="text-sm text-gray-500 mt-1">Khusus mahasiswa</p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field
            label="Nama Lengkap"
            name="nama"
            placeholder="Nama sesuai KTM"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
          />
          <Field
            label="NIM"
            name="nim"
            placeholder="Nomor Induk Mahasiswa"
            value={form.nim}
            onChange={(e) => setForm({ ...form, nim: e.target.value })}
          />
          <Field
            label="Email"
            name="email"
            type="email"
            placeholder="email@contoh.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Field
            label="Password"
            name="password"
            type="password"
            placeholder="Minimal 6 karakter"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Field
            label="Konfirmasi Password"
            name="confirmPassword"
            type="password"
            placeholder="Ulangi password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            {loading ? "Mendaftar..." : "Daftar"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
