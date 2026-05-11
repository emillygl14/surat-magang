import React from "react";
import { Link } from "react-router-dom";
import bgImage from "../assets/bg-landingpage.jpg";
import { FiInfo, FiBookOpen, FiArrowRight } from "react-icons/fi";

function Logo({ size = "md" }) {
  return (
    <div className="flex flex-col leading-none">
      <span
        className={`text-gray-400 ${size === "sm" ? "text-[9px]" : "text-[10px]"} tracking-widest uppercase`}
      >
        Polimdo
      </span>
      <span
        className={`text-white font-black tracking-tight ${size === "sm" ? "text-lg" : "text-2xl"}`}
      >
        ELE<span className="text-red-500">/</span>TRO
      </span>
    </div>
  );
}

export default function LandingPage() {
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
          <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-300 bg-transparent">
            <Logo />
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
            {/* Mobile login */}
            <Link
              to="/login"
              className="md:hidden bg-[#1e3a8a] text-white text-sm font-medium px-4 py-2 rounded"
            >
              Login
            </Link>
          </nav>

          {/* Hero Content */}
          <div className="flex-1 flex flex-col justify-center px-8 md:px-16 max-w-3xl">
            <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight mb-6">
              Sistem Pengajuan dan Pengelolaan Surat Magang Mahasiswa
            </h1>
            <p className="text-gray-200 text-base md:text-lg leading-relaxed max-w-xl mb-10">
              Sistem terintegrasi untuk memudahkan mahasiswa dalam mengajukan
              surat magang dan memudahkan admin dalam mengelola surat secara
              efisien dan transparan.
            </p>

          </div>

          {/* Floating Info card */}
          <div className="px-8 md:px-16 pb-12">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 max-w-lg flex items-start gap-5 shadow-2xl border border-white/20">
              <div className="w-16 h-16 rounded-full bg-[#0d1b3e] flex items-center justify-center shrink-0 shadow-lg">
                <FiInfo className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
                  Informasi Jurusan
                </p>
                <p className="font-bold text-[#0d1b3e] text-lg mb-1">
                  Jurusan Teknik Elektro
                </p>
                <p className="text-xs text-gray-500 mb-3 font-medium">
                  Politeknik Negeri Indramayu
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Jurusan Teknik Elektro berkomitmen mencetak lulusan kompeten
                  dan siap bersaing di dunia industri global.
                </p>
                <a
                  href="#informasi-jurusan"
                  className="inline-flex items-center gap-2 bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-all shadow-md"
                >
                  Selengkapnya <FiArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informasi Jurusan Section */}
      <section id="informasi-jurusan" className="py-24 px-8 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0d1b3e] mb-4">
              Informasi Jurusan
            </h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Tentang Teknik Elektro Polimdo
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Jurusan Teknik Elektro Politeknik Negeri Manado memiliki misi
                untuk menyelenggarakan pendidikan vokasi yang berkualitas
                tinggi, relevan dengan kebutuhan industri, dan berwawasan
                lingkungan.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Fasilitas Modern",
                  "Kurikulum Industri",
                  "Dosen Praktisi",
                  "Sertifikasi Kompetensi",
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-gray-700 font-medium"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-100 rounded-3xl h-80 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
              <span className="text-sm font-medium">Ilustrasi Jurusan</span>
            </div>
          </div>
        </div>
      </section>

      {/* Panduan Section */}
      <section id="panduan" className="py-24 px-8 md:px-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 mb-6 shadow-sm">
              <FiBookOpen className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0d1b3e] mb-4">
              Prosedur Magang Industri
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-lg">
              Berikut adalah langkah-langkah yang harus diikuti untuk pengajuan
              dan pelaksanaan magang industri.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8 md:p-12 space-y-6">
              {panduanProsedur.map((item, index) => (
                <div key={index} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 pt-2 leading-relaxed font-medium">
                    {item}
                  </p>
                </div>
              ))}
            </div>
            <div className="bg-[#0d1b3e] p-8 text-center">
              <p className="text-blue-100 text-sm leading-relaxed mb-6 font-medium">
                Mohon seluruh mahasiswa mengikuti prosedur ini dengan tertib
                agar proses administrasi magang dapat berjalan dengan baik.
              </p>
              <p className="text-white font-bold text-lg italic">
                Terima kasih.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 md:px-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <Logo size="sm" />
            <p className="text-gray-400 text-xs mt-3">
              &copy; 2024 Jurusan Teknik Elektro. Politeknik Negeri Manado.
            </p>
          </div>
          <div className="flex gap-8 text-gray-400 text-sm font-medium">
            <a
              href="#beranda"
              className="hover:text-blue-600 transition-colors"
            >
              Beranda
            </a>
            <a
              href="#informasi-jurusan"
              className="hover:text-blue-600 transition-colors"
            >
              Informasi Jurusan
            </a>
            <a
              href="#panduan"
              className="hover:text-blue-600 transition-colors"
            >
              Panduan
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
