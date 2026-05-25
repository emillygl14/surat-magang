import React, { useState, useEffect } from "react";
import { FiEye } from "react-icons/fi";
import { BsFileEarmarkText, BsClock, BsCheckCircle, BsXCircle } from "react-icons/bs";
import { useAuth } from "../../context/AuthContext";
import api, { FILE_URL } from "../../services/api";

const STATUS_BADGE = {
  PENDING: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  PROSES: "bg-blue-100 text-blue-700 border border-blue-200",
  SELESAI: "bg-green-100 text-green-700 border border-green-200",
  DITOLAK: "bg-red-100 text-red-600 border border-red-200",
};
const STATUS_LABEL = {
  PENDING: "Menunggu Verifikasi",
  PROSES: "Sedang Diproses",
  SELESAI: "Selesai",
  DITOLAK: "Ditolak",
};

const formatDate = (d) => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

export default function Dashboard() {
  const { user } = useAuth();
  const [pengajuan, setPengajuan] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/pengajuan/my");
        setPengajuan(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const counts = {
    total: pengajuan.length,
    menunggu: pengajuan.filter((p) => p.status === "PENDING").length,
    diproses: pengajuan.filter((p) => p.status === "PROSES").length,
    selesai: pengajuan.filter((p) => p.status === "SELESAI").length,
    ditolak: pengajuan.filter((p) => p.status === "DITOLAK").length,
  };

  const recent = pengajuan.slice(0, 5);

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between shrink-0">
        <h1 className="text-base sm:text-xl font-bold text-gray-900">Dashboard Mahasiswa</h1>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-right leading-tight">
            <p className="text-sm font-semibold text-gray-900">{user?.nama}</p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{user?.nim}</p>
          </div>
          <img 
            src={user?.fotoProfil ? `${FILE_URL}${user.fotoProfil}` : `https://ui-avatars.com/api/?name=${user?.nama}&background=0D8ABC&color=fff`} 
            alt="Profile" 
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-gray-100"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${user?.nama}&background=0D8ABC&color=fff`;
            }}
          />
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-8">
        <div className="mb-4 sm:mb-6">
          <p className="text-gray-500 text-sm">Selamat datang,</p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{user?.nama}</h2>
          <p className="text-gray-500 text-sm mt-0.5">Kelola pengajuan surat magang Anda dengan mudah dan cepat.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard label="Total Pengajuan" value={counts.total} desc="Semua pengajuan surat" icon={<BsFileEarmarkText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />} iconBg="bg-blue-50" />
          <StatCard label="Menunggu" value={counts.menunggu} desc="Menunggu verifikasi" icon={<BsClock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />} iconBg="bg-yellow-50" />
          <StatCard label="Diproses" value={counts.diproses} desc="Sedang dikerjakan" icon={<BsClock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />} iconBg="bg-blue-50" />
          <StatCard label="Selesai" value={counts.selesai} desc="Surat siap diunduh" icon={<BsCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />} iconBg="bg-green-50" />
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Pengajuan Terbaru</h3>
          </div>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            {recent.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-sm">Belum ada pengajuan surat.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">No</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Jenis Surat</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Tanggal Pengajuan</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((p, i) => (
                    <tr key={p.id} className="border-b border-gray-50">
                      <td className="px-6 py-4 text-gray-500">{i + 1}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{p.jenisSurat}</td>
                      <td className="px-6 py-4 text-gray-600">{formatDate(p.createdAt)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGE[p.status]}`}>
                          {STATUS_LABEL[p.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/* Mobile card list */}
          <div className="sm:hidden">
            {recent.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">Belum ada pengajuan surat.</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recent.map((p) => (
                  <div key={p.id} className="px-4 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900 leading-snug">{p.jenisSurat}</p>
                      <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[p.status]}`}>
                        {STATUS_LABEL[p.status]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(p.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

function StatCard({ label, value, desc, icon, iconBg }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>{icon}</div>
      </div>
      <p className="text-xs text-gray-400">{desc}</p>
    </div>
  );
}
