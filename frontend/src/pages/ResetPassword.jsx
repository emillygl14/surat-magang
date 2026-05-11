import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiLock, FiEye, FiEyeOff, FiKey } from "react-icons/fi";
import api from "../services/api";
import toast from "react-hot-toast";
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

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Konfirmasi password tidak cocok");
    }
    if (password.length < 6) {
      return toast.error("Password minimal 6 karakter");
    }
    if (!token) {
      return toast.error("Token tidak ditemukan");
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      toast.success("Password berhasil direset! Silakan login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal mereset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex w-1/2 relative flex-col justify-between p-12"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#0d1b3e]/80" />
        <div className="relative z-10">
          <Logo />
          <div className="mt-16">
            <h2 className="text-white text-3xl font-bold leading-tight">
              Buat Password Baru
            </h2>
            <div className="w-10 h-0.5 bg-blue-500 my-5" />
            <p className="text-gray-300 text-sm leading-relaxed">
              Keamanan akun Anda adalah prioritas kami. Gunakan kombinasi password yang kuat.
            </p>
          </div>
        </div>
        <div className="relative z-10">
          <p className="text-gray-400 text-xs">© 2024 Jurusan Teknik Elektro</p>
          <p className="text-gray-400 text-xs">Politeknik Negeri Manado</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold text-[#0d1b3e] mb-1">Set Password Baru</h1>
          <p className="text-gray-400 text-sm mb-8">
            Silakan masukkan password baru Anda
          </p>

          {!token && (
            <div className="mb-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              Token tidak valid. Silakan minta link reset baru.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[#0d1b3e] mb-2">
                Password Baru
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password baru"
                  required
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-11 py-3 text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0d1b3e] mb-2">
                Konfirmasi Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password baru"
                  required
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full bg-[#0d1b3e] hover:bg-[#1a2f5e] disabled:opacity-60
                         text-white font-bold py-3.5 rounded-lg transition-colors text-sm tracking-wide"
            >
              {loading ? "Menyimpan..." : "Simpan Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
