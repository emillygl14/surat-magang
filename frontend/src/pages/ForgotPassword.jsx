import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiArrowLeft } from "react-icons/fi";
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

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("Token reset berhasil dikirim! Silakan cek email Anda.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal mengirim permintaan");
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
              Lupa Password?
            </h2>
            <div className="w-10 h-0.5 bg-blue-500 my-5" />
            <p className="text-gray-300 text-sm leading-relaxed">
              Jangan khawatir! Masukkan email Anda dan kami akan mengirimkan
              instruksi untuk mereset password Anda.
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
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0d1b3e] mb-8 transition-colors"
          >
            <FiArrowLeft /> Kembali ke Login
          </Link>

          <h1 className="text-3xl font-bold text-[#0d1b3e] mb-1">Reset Password</h1>
          <p className="text-gray-400 text-sm mb-8">
            Masukkan email terdaftar untuk menerima token reset
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#0d1b3e] mb-2">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email Anda"
                  required
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0d1b3e] hover:bg-[#1a2f5e] disabled:opacity-60
                         text-white font-bold py-3.5 rounded-lg transition-colors text-sm tracking-wide"
            >
              {loading ? "Mengirim..." : "Kirim Instruksi"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
