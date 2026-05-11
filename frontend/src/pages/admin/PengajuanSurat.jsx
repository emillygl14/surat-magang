import React, { useState, useEffect } from "react";
import { FiEye, FiX } from "react-icons/fi";
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

export default function PengajuanSurat() {
  const { user } = useAuth();
  const [pengajuan, setPengajuan] = useState([]);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const res = await api.get("/pengajuan");
      setPengajuan(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = pengajuan.filter(p => 
    p.user?.nama.toLowerCase().includes(search.toLowerCase()) ||
    p.jenisSurat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Semua Pengajuan Surat</h1>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{user?.nama}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <img src={`https://ui-avatars.com/api/?name=${user?.nama}&background=0D8ABC&color=fff`} alt="Profile" className="w-9 h-9 rounded-full" />
        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <input 
              type="text" 
              placeholder="Cari nama atau jenis surat..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>

          <div className="overflow-x-auto">
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-sm">Data tidak ditemukan.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">No</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Nama Mahasiswa</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Jenis Surat</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => (
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
                      <td className="px-6 py-4">
                        <button onClick={() => setModal(p)} className="text-blue-600 hover:text-blue-800 transition-colors font-medium text-xs">
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={(e) => { if (e.target === e.currentTarget) setModal(null); }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-gray-900">Tinjau Pengajuan</h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600"><FiX className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-gray-500 mb-1">{modal.jenisSurat}</p>
            <p className="text-xs text-gray-400 mb-5">{modal.user?.nama} · NIM {modal.user?.nim || "-"}</p>
            
            <div className="space-y-3 text-sm mb-5">
              <Row label="Perusahaan" value={modal.namaPerusahaan} />
              <Row label="Alamat" value={modal.alamatPerusahaan} />
              <Row label="Tanggal" value={`${formatDate(modal.tanggalMulai)} – ${formatDate(modal.tanggalSelesai)}`} />
              <Row label="Keperluan" value={modal.keperluan} />
              <div className="flex justify-between pt-1">
                <span className="text-gray-500 shrink-0">File Pendukung</span>
                <span className="text-right">
                  {modal.filePendukung ? (
                    <a href={`http://localhost:5000${modal.filePendukung}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat File</a>
                  ) : "-"}
                </span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 border border-gray-100 rounded-lg">
                <p className="text-xs text-gray-500 font-medium">Status Pengajuan: <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${STATUS_BADGE[modal.status]}`}>{STATUS_LABEL[modal.status]}</span></p>
                {modal.catatan && (
                    <p className="text-sm text-gray-700 mt-2"><span className="font-semibold text-gray-900 text-xs block">Catatan:</span> {modal.catatan}</p>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className="text-gray-900 text-right">{value}</span>
    </div>
  );
}
