import React, { useState, useEffect } from "react";
import { FiEye, FiX, FiClock } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import api, { FILE_URL } from "../../services/api";
import toast from "react-hot-toast";

const STATUS_BADGE = {
  PENDING: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  PROSES: "bg-blue-100 text-blue-700 border border-blue-200",
  SELESAI: "bg-green-100 text-green-700 border border-green-200",
  DITOLAK: "bg-red-100 text-red-700 border border-red-200",
};
const STATUS_LABEL = {
  PENDING: "Menunggu Verifikasi",
  PROSES: "Sedang Diproses",
  SELESAI: "Selesai",
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
      toast.success("Pengajuan berhasil dihapus");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menghapus pengajuan");
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 h-16 flex items-center justify-between shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Riwayat Pengajuan</h1>
        <div className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <p className="text-sm font-semibold text-gray-900">{user?.nama}</p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{user?.nim}</p>
          </div>
          <img 
            src={user?.fotoProfil ? `${FILE_URL}${user.fotoProfil}` : `https://ui-avatars.com/api/?name=${user?.nama}&background=0D8ABC&color=fff`} 
            alt="Profile" 
            className="w-9 h-9 rounded-full object-cover border border-gray-100"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${user?.nama}&background=0D8ABC&color=fff`;
            }}
          />
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
              <Row label="Tanggal Pengajuan" value={formatDate(viewItem.createdAt)} />
              <Row label="Keperluan" value={viewItem.keperluan} />
              
              <div className="flex justify-between pt-1">
                <span className="text-gray-500 shrink-0">File Pendukung</span>
                <span className="text-right">
                  {viewItem.filePendukung ? (
                    <a href={`${FILE_URL}${viewItem.filePendukung}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Lihat File</a>
                  ) : "-"}
                </span>
              </div>

              <div className="flex justify-between pt-1">
                <span className="text-gray-500">Status</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGE[viewItem.status]}`}>
                  {STATUS_LABEL[viewItem.status]}
                </span>
              </div>

              {viewItem.status === "SELESAI" && viewItem.tglSelesaiSurat && (
                <Row label="Tanggal Selesai" value={formatDate(viewItem.tglSelesaiSurat)} />
              )}

              {/* Display Rejection Reason */}
              {viewItem.status === "DITOLAK" && viewItem.alasanPenolakan && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mt-2">
                  <p className="text-xs font-bold text-red-700 mb-1">Alasan Penolakan:</p>
                  <p className="text-sm text-red-600">{viewItem.alasanPenolakan}</p>
                </div>
              )}

              {/* Display Admin Note */}
              {viewItem.catatan && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 mt-2">
                  <p className="text-xs font-bold text-gray-500 mb-1">Catatan Admin:</p>
                  <p className="text-sm text-gray-700">{viewItem.catatan}</p>
                </div>
              )}

              {/* Download Finished Letter */}
              {viewItem.status === "SELESAI" && viewItem.fileSelesai && (
                <div className="pt-4">
                  <a 
                    href={`${FILE_URL}${viewItem.fileSelesai}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    Download Surat Selesai
                  </a>
                </div>
              )}

              {/* Riwayat Sederhana */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <FiClock className="w-3.5 h-3.5" /> Riwayat Status
                </h4>
                <div className="space-y-3">
                  <div className="flex gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 leading-none">Pengajuan Dibuat</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(viewItem.createdAt)}</p>
                    </div>
                  </div>
                  {viewItem.updatedAt !== viewItem.createdAt && (
                    <div className="flex gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 leading-none">Terakhir Diperbarui</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(viewItem.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
