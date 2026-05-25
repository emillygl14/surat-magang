import React from "react";
import { Link } from "react-router-dom";
import bgImage from "../assets/bg-landingpage.jpg";
import iluJurusan from "../assets/jurusan-elektro.png";
import { FiInfo, FiBookOpen, FiArrowRight, FiMenu, FiX, FiZap } from "react-icons/fi";
import { useState, useEffect } from "react";

function Logo({ size = "md", variant = "light" }) {
  const textColor = variant === "dark" ? "text-[#0d1b3e]" : "text-white";
  return (
    <div className="flex flex-col leading-none">
      <span
        className={`text-gray-400 ${size === "sm" ? "text-[9px]" : "text-[10px]"} tracking-widest uppercase font-bold`}
      >
        Polimdo
      </span>
      <div className="flex items-center gap-1">
        <span
          className={`${textColor} font-black tracking-tighter ${size === "sm" ? "text-lg" : "text-2xl"}`}
        >
          ELEK
        </span>
        <FiZap className={`${size === "sm" ? "w-4 h-4" : "w-6 h-6"} text-yellow-400 fill-yellow-400 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]`} />
        <span
          className={`${textColor} font-black tracking-tighter ${size === "sm" ? "text-lg" : "text-2xl"}`}
        >
          TRO
        </span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const panduanProsedur = [
    "Mahasiswa mencari tempat magang secara mandiri.",
    "Setelah mendapatkan calon perusahaan/instansi, mahasiswa mengirimkan nama tempat magang tersebut kepada panitia.",
    "Panitia akan membuatkan surat permohonan magang.",
    "Mahasiswa mengambil atau menerima surat permohonan tersebut dari panitia.",
    "Mahasiswa membawa dan menyerahkan surat permohonan ke perusahaan/instansi tujuan.",
    "Setelah itu, mahasiswa menunggu surat balasan resmi dari perusahaan/instansi.",
    "Jika surat balasan menyatakan diterima, mahasiswa segera melaporkannya kepada panitia untuk proses selanjutnya.",
    "Jika belum diterima, mahasiswa dapat mencari tempat magang lain dan mengajukan kembali melalui prosedur yang sama.",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="h-screen relative flex flex-col"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        id="beranda"
      >
        {/* Overlay gelap */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Konten Hero */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Navbar */}
          <nav
            className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-300 ${isScrolled || isMenuOpen ? "bg-[#0d1b3e] shadow-lg" : "bg-transparent"
              }`}
          >
            <Logo />

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#beranda"
                className="text-white text-sm hover:text-blue-300 transition-colors font-medium"
              >
                Beranda
              </a>
              <a
                href="#informasi-jurusan"
                className="text-white text-sm hover:text-blue-300 transition-colors font-medium"
              >
                Informasi Jurusan
              </a>
              <a
                href="#panduan"
                className="text-white text-sm hover:text-blue-300 transition-colors font-medium"
              >
                Panduan
              </a>
              <Link
                to="/login"
                className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-sm font-medium px-5 py-2 rounded transition-colors"
              >
                Login
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white p-2"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </nav>

          {/* Mobile Menu Overlay */}
          {isMenuOpen && (
            <div className="fixed inset-0 z-40 bg-[#0d1b3e] md:hidden pt-24 px-8 flex flex-col gap-6">
              <a
                href="#beranda"
                onClick={() => setIsMenuOpen(false)}
                className="text-white text-xl font-semibold border-b border-white/10 pb-4"
              >
                Beranda
              </a>
              <a
                href="#informasi-jurusan"
                onClick={() => setIsMenuOpen(false)}
                className="text-white text-xl font-semibold border-b border-white/10 pb-4"
              >
                Informasi Jurusan
              </a>
              <a
                href="#panduan"
                onClick={() => setIsMenuOpen(false)}
                className="text-white text-xl font-semibold border-b border-white/10 pb-4"
              >
                Panduan
              </a>
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="bg-blue-600 text-white text-center text-xl font-bold py-4 rounded-xl shadow-lg mt-4"
              >
                Login ke Akun
              </Link>
            </div>
          )}

          {/* Hero Content */}
          <div className="flex-1 flex flex-col justify-end px-5 md:px-16 pb-16 md:pb-32">
            <div className="max-w-4xl">
              <h1 className="text-3xl md:text-7xl font-black text-white leading-[1.05] mb-4 md:mb-6 tracking-tighter drop-shadow-lg">
                Sistem Pengajuan dan
                <br />
                Pengelolaan Surat Magang
                <br />
                Mahasiswa
              </h1>
              <p className="text-gray-200 text-base md:text-xl leading-relaxed max-w-2xl mb-8 md:mb-10 opacity-90 drop-shadow-md">
                Sistem terintegrasi untuk memudahkan mahasiswa dalam mengajukan
                surat magang dan memudahkan admin dalam mengelola surat secara
                efisien dan transparan.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg transition-all shadow-2xl shadow-blue-600/30 flex items-center gap-3 group"
                >
                  Mulai Sekarang
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informasi Jurusan Section */}
      <section id="informasi-jurusan" className="py-16 md:py-24 px-5 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-[#0d1b3e] mb-4">
              Informasi Jurusan
            </h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-5">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                Tentang Teknik Elektro Polimdo
              </h3>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                Jurusan Teknik Elektro Politeknik Negeri Manado memiliki misi
                untuk menyelenggarakan pendidikan vokasi yang berkualitas
                tinggi, relevan dengan kebutuhan industri, dan berwawasan
                lingkungan.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Fasilitas Modern",
                  "Kurikulum Industri",
                  "Dosen Praktisi",
                  "Sertifikasi Kompetensi",
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-gray-700 font-medium text-sm md:text-base"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl h-64 md:h-80 border border-gray-100">
                <img src={iluJurusan} alt="Teknik Elektro Polimdo" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Panduan Section */}
      <section id="panduan" className="py-16 md:py-24 px-5 md:px-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-blue-100 text-blue-600 mb-5 shadow-sm">
              <FiBookOpen className="w-7 h-7 md:w-8 md:h-8" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-[#0d1b3e] mb-4">
              Prosedur Magang Industri
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-base md:text-lg">
              Berikut adalah langkah-langkah yang harus diikuti untuk pengajuan
              dan pelaksanaan magang industri.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-6 md:p-12 space-y-5">
              {panduanProsedur.map((item, index) => (
                <div key={index} className="flex gap-4 md:gap-6 group">
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 pt-1.5 leading-relaxed font-medium text-sm md:text-base">
                    {item}
                  </p>
                </div>
              ))}
            </div>
            <div className="bg-[#0d1b3e] p-6 md:p-8 text-center">
              <p className="text-blue-100 text-sm leading-relaxed mb-4 font-medium">
                Mohon seluruh mahasiswa mengikuti prosedur ini dengan tertib
                agar proses administrasi magang dapat berjalan dengan baik.
              </p>
              <p className="text-white font-bold text-base md:text-lg italic">
                Terima kasih.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-5 md:px-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <Logo size="sm" variant="dark" />
            <p className="text-gray-400 text-xs mt-2">
              &copy; 2026 Jurusan Teknik Elektro. Politeknik Negeri Manado.
            </p>
          </div>
          <div className="flex gap-6 text-gray-400 text-sm font-medium">
            <a href="#beranda" className="hover:text-blue-600 transition-colors">Beranda</a>
            <a href="#informasi-jurusan" className="hover:text-blue-600 transition-colors">Informasi Jurusan</a>
            <a href="#panduan" className="hover:text-blue-600 transition-colors">Panduan</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
