import React, { useState, useEffect } from "react";
import { FiEye, FiCheck, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import api, { FILE_URL } from "../../services/api";

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

export default function VerifikasiSurat() {
  const { user } = useAuth();
  const [pengajuan, setPengajuan] = useState([]);
  const [modal, setModal] = useState(null);
  const [catatan, setCatatan] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const res = await api.get("/pengajuan");
      // Only show PENDING for verification page
      setPengajuan(res.data.filter(p => p.status === "PENDING"));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (status) => {
    setLoading(true);
    try {
      await api.patch(`/pengajuan/${modal.id}/status`, { status, catatan });
      setModal(null);
      setCatatan("");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal memperbarui status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Verifikasi Surat</h1>
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
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Menunggu Verifikasi</h3>
            <p className="text-xs text-gray-500 mt-1">Daftar pengajuan surat magang yang membutuhkan persetujuan.</p>
          </div>

          <div className="overflow-x-auto">
            {pengajuan.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-sm">Tidak ada pengajuan yang menunggu verifikasi.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">No</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Nama Mahasiswa</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Jenis Surat</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {pengajuan.map((p, i) => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-500">{i + 1}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{p.user?.nama}</td>
                      <td className="px-6 py-4 text-gray-600">{p.jenisSurat}</td>
                      <td className="px-6 py-4 text-gray-600">{formatDate(p.createdAt)}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => { setModal(p); setCatatan(""); }} className="bg-[#0d1b3e] hover:bg-[#1a2f5e] text-white px-4 py-1.5 rounded-lg font-medium text-xs transition-colors">
                          Verifikasi
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
              <h3 className="font-bold text-gray-900">Proses Pengajuan</h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600"><FiX className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-gray-500 mb-1">{modal.jenisSurat}</p>
            <p className="text-xs text-gray-400 mb-5">{modal.user?.nama} · NIM {modal.user?.nim || "-"}</p>
            
            <div className="space-y-3 text-sm mb-5 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <Row label="Perusahaan" value={modal.namaPerusahaan} />
              <Row label="Alamat" value={modal.alamatPerusahaan} />
              <Row label="Tanggal" value={`${formatDate(modal.tanggalMulai)} – ${formatDate(modal.tanggalSelesai)}`} />
              <Row label="Keperluan" value={modal.keperluan} />
              <div className="flex justify-between pt-1">
                <span className="text-gray-500 shrink-0">File Pendukung</span>
                <span className="text-right">
                  {modal.filePendukung ? (
                    <a href={`${FILE_URL}${modal.filePendukung}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat File</a>
                  ) : "-"}
                </span>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Catatan Admin <span className="text-gray-400 font-normal">(opsional)</span>
              </label>
              <textarea
                rows={3}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Tulis alasan persetujuan atau penolakan jika diperlukan..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => handleUpdateStatus("DISETUJUI")}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FiCheck className="w-4 h-4" /> Setujui
              </button>
              <button
                onClick={() => handleUpdateStatus("DITOLAK")}
                disabled={loading}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FiX className="w-4 h-4" /> Tolak
              </button>
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
