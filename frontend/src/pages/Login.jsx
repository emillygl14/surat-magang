import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import bgImage from "../assets/bg-landingpage.jpg";

function Logo() {
  return (
    <div className="flex flex-col leading-none">
      <span className="text-gray-400 text-[10px] tracking-widest uppercase">
        Polimdo
      </span>
      <span className="text-white font-black text-2xl tracking-tight">
        ELEK<span className="text-red-500">/</span>TRO
      </span>
    </div>
  );
}

export default function Login() {
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
      // Bersihkan state agar tidak muncul lagi saat refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { nim, password });
      login(res.data.user, res.data.token);
      toast.success("Login berhasil!");
      navigate(res.data.user.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "NIM atau password salah";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Kiri — foto + overlay */}
      <div
        className="hidden lg:flex w-1/2 relative flex-col justify-between p-12"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#0d1b3e]/80" />

        {/* Logo & teks */}
        <div className="relative z-10">
          <Logo />
          <div className="mt-16">
            <h2 className="text-white text-3xl font-bold leading-tight">
              Sistem Pengajuan dan
              <br />
              Pengelolaan Surat Magang
              <br />
              Mahasiswa
            </h2>
            <div className="w-10 h-0.5 bg-blue-500 my-5" />
            <p className="text-gray-300 text-sm leading-relaxed">
              Silakan login untuk mengajukan
              <br />
              dan mengelola surat magang.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-gray-400 text-xs">© 2024 Jurusan Teknik Elektro</p>
          <p className="text-gray-400 text-xs">Politeknik Negeri Manado</p>
        </div>
      </div>

      {/* Kanan — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex flex-col leading-none">
            <span className="text-gray-500 text-[10px] tracking-widest uppercase">
              Polindra
            </span>
            <span className="text-[#0d1b3e] font-black text-2xl tracking-tight">
              ELEK<span className="text-red-500">/</span>TRO
            </span>
          </div>

          <h1 className="text-3xl font-bold text-[#0d1b3e] mb-1">Login</h1>
          <p className="text-gray-400 text-sm mb-8">
            Masuk ke akun Anda untuk melanjutkan
          </p>

          {error && (
            <div className="mb-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NIM */}
            <div>
              <label className="block text-sm font-bold text-[#0d1b3e] mb-2">
                NIM
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  placeholder="Masukkan NIM Anda"
                  required
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-[#0d1b3e] mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
                  required
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-11 py-3 text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-4 h-4" />
                  ) : (
                    <FiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Ingat saya + lupa password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Ingat saya
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Lupa password?
              </Link>
            </div>

            {/* Tombol login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0d1b3e] hover:bg-[#1a2f5e] disabled:opacity-60
                         text-white font-bold py-3.5 rounded-lg transition-colors text-sm tracking-wide"
            >
              {loading ? "Memproses..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-7">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
