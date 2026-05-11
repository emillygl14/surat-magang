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

export default function RiwayatPengajuan() {
  const { user } = useAuth();
  const [pengajuan, setPengajuan] = useState([]);
  const [viewItem, setViewItem] = useState(null);

  const fetchData = async () => {
    try {
      const res = await api.get("/pengajuan/my");
      setPengajuan(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus pengajuan ini?")) return;
    try {
      await api.delete(`/pengajuan/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus");
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Riwayat Pengajuan</h1>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{user?.nama}</p>
            <p className="text-xs text-gray-500">{user?.nim}</p>
          </div>
          <img src={user?.fotoProfil ? `http://localhost:5000${user.fotoProfil}` : `https://ui-avatars.com/api/?name=${user?.nama}`} alt="Profile" className="w-9 h-9 rounded-full object-cover" />
        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Semua Pengajuan Anda</h3>
          </div>

          <div className="overflow-x-auto">
            {pengajuan.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-sm">Belum ada riwayat pengajuan.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">No</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Jenis Surat</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Tanggal Pengajuan</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {pengajuan.map((p, i) => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-500">{i + 1}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{p.jenisSurat}</td>
                      <td className="px-6 py-4 text-gray-600">{formatDate(p.createdAt)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGE[p.status]}`}>
                          {STATUS_LABEL[p.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setViewItem(p)} className="text-gray-500 hover:text-[#0d1b3e] transition-colors" title="Lihat detail">
                            <FiEye className="w-4 h-4" />
                          </button>
                          {p.status === "PENDING" && (
                            <button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Hapus">
                              <FiX className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Modal detail */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={(e) => { if (e.target === e.currentTarget) setViewItem(null); }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Detail Pengajuan</h3>
              <button onClick={() => setViewItem(null)} className="text-gray-400 hover:text-gray-600"><FiX className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <Row label="Jenis Surat" value={viewItem.jenisSurat} />
              <Row label="Perusahaan" value={viewItem.namaPerusahaan} />
              <Row label="Alamat" value={viewItem.alamatPerusahaan} />
              <Row label="Tanggal Mulai" value={formatDate(viewItem.tanggalMulai)} />
              <Row label="Tanggal Selesai" value={formatDate(viewItem.tanggalSelesai)} />
              <Row label="Keperluan" value={viewItem.keperluan} />
              
              <div className="flex justify-between pt-1">
                <span className="text-gray-500 shrink-0">File Pendukung</span>
                <span className="text-right">
                  {viewItem.filePendukung ? (
                    <a href={`http://localhost:5000${viewItem.filePendukung}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat File</a>
                  ) : "-"}
                </span>
              </div>

              <div className="flex justify-between pt-1">
                <span className="text-gray-500">Status</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGE[viewItem.status]}`}>
                  {STATUS_LABEL[viewItem.status]}
                </span>
              </div>
              {viewItem.catatan && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 mt-2">
                  <p className="text-xs font-medium text-gray-600 mb-1">Catatan Admin:</p>
                  <p className="text-xs text-gray-700">{viewItem.catatan}</p>
                </div>
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
