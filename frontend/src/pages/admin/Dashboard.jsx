import React, { useState, useEffect } from "react";
import { BsFileEarmarkText, BsClock, BsCheckCircle, BsXCircle } from "react-icons/bs";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const STATUS_BADGE = {
  PENDING: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  DISETUJUI: "bg-green-100 text-green-700 border border-green-200",
  DITOLAK: "bg-red-100 text-red-600 border border-red-200",
};
const STATUS_LABEL = {
  PENDING: "Diproses",
  DISETUJUI: "Disetujui",
  DITOLAK: "Ditolak",
};

const formatDate = (d) => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

export default function Dashboard() {
  const { user } = useAuth();
  const [pengajuan, setPengajuan] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/pengajuan");
        setPengajuan(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const counts = {
    total: pengajuan.length,
    diproses: pengajuan.filter((p) => p.status === "PENDING").length,
    disetujui: pengajuan.filter((p) => p.status === "DISETUJUI").length,
    ditolak: pengajuan.filter((p) => p.status === "DITOLAK").length,
  };

  const recent = pengajuan.slice(0, 5);

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Dashboard Admin</h1>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{user?.nama}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <img src={`https://ui-avatars.com/api/?name=${user?.nama}&background=0D8ABC&color=fff`} alt="Profile" className="w-9 h-9 rounded-full" />
        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="mb-6">
          <p className="text-gray-500 text-sm">Selamat datang,</p>
          <h2 className="text-2xl font-bold text-gray-900">Admin Jurusan Teknik Elektro</h2>
          <p className="text-gray-500 text-sm mt-0.5">Kelola pengajuan dan data surat magang mahasiswa.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Pengajuan" value={counts.total} desc="Semua pengajuan surat" icon={<BsFileEarmarkText className="w-6 h-6 text-blue-600" />} iconBg="bg-blue-50" />
          <StatCard label="Diproses" value={counts.diproses} desc="Sedang diproses" icon={<BsClock className="w-6 h-6 text-yellow-600" />} iconBg="bg-yellow-50" />
          <StatCard label="Disetujui" value={counts.disetujui} desc="Pengajuan disetujui" icon={<BsCheckCircle className="w-6 h-6 text-green-600" />} iconBg="bg-green-50" />
          <StatCard label="Ditolak" value={counts.ditolak} desc="Pengajuan ditolak" icon={<BsXCircle className="w-6 h-6 text-red-500" />} iconBg="bg-red-50" />
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Pengajuan Terbaru</h3>
          </div>

          <div className="overflow-x-auto">
            {recent.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-sm">Belum ada pengajuan masuk.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">No</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Nama Mahasiswa</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Jenis Surat</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((p, i) => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-500">{i + 1}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{p.user?.nama}</td>
                      <td className="px-6 py-4 text-gray-600">{p.jenisSurat}</td>
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
