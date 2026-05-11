import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../services/api";

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
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, name, type = "text", placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        required
        value={form[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );

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
          />
          <Field label="NIM" name="nim" placeholder="Nomor Induk Mahasiswa" />
          <Field
            label="Email"
            name="email"
            type="email"
            placeholder="email@contoh.com"
          />
          <Field
            label="Password"
            name="password"
            type="password"
            placeholder="Minimal 6 karakter"
          />
          <Field
            label="Konfirmasi Password"
            name="confirmPassword"
            type="password"
            placeholder="Ulangi password"
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
