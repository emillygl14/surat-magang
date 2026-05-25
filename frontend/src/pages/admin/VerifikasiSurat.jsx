import React, { useState, useEffect } from "react";
import { FiEye, FiCheck, FiX, FiMoreVertical, FiClock, FiAlertTriangle } from "react-icons/fi";
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

export default function VerifikasiSurat() {
  const { user } = useAuth();
  const [pengajuan, setPengajuan] = useState([]);
  const [modal, setModal] = useState(null);
  const [catatan, setCatatan] = useState("");
  const [alasanPenolakan, setAlasanPenolakan] = useState("");
  const [fileSelesai, setFileSelesai] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showFinishForm, setShowFinishForm] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // ID pengajuan untuk dropdown

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/pengajuan");
      // Show all except final statuses if you want, or just show all. 
      // User wants to manage the workflow, so showing PENDING and PROSES is key.
      setPengajuan(res.data.filter(p => p.status === "PENDING" || p.status === "PROSES"));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (status) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("status", status);
    formData.append("catatan", catatan);
    
    
    if (status === "DITOLAK") {
      if (!alasanPenolakan.trim()) {
        toast.error("Alasan penolakan wajib diisi");
        setLoading(false);
        return;
      }
      formData.append("alasanPenolakan", alasanPenolakan);
    }
    
    if (status === "SELESAI" && fileSelesai) {
      formData.append("fileSelesai", fileSelesai);
    }

    try {
      await api.patch(`/pengajuan/${modal.id}/status`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Status pengajuan berhasil diperbarui");
      setModal(null);
      resetForms();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memperbarui status");
    } finally {
      setLoading(false);
    }
  };

  const resetForms = () => {
    setCatatan("");
    setAlasanPenolakan("");
    setFileSelesai(null);
    setShowRejectForm(false);
    setShowFinishForm(false);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 h-16 flex items-center justify-between shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Verifikasi Surat</h1>
        <div className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <p className="text-sm font-semibold text-gray-900">{user?.nama}</p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Administrator</p>
          </div>
          <img src={`https://ui-avatars.com/api/?name=${user?.nama}&background=0D8ABC&color=fff`} alt="Profile" className="w-9 h-9 rounded-full border border-gray-100" />
        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Pengajuan Aktif</h3>
            <p className="text-xs text-gray-500 mt-1">Daftar pengajuan yang sedang menunggu verifikasi atau dalam proses.</p>
          </div>

          <div className="overflow-x-auto">
            {pengajuan.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-sm">Tidak ada pengajuan aktif saat ini.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">No</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Mahasiswa</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Jenis Surat</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {pengajuan.map((p, i) => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-500">{i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{p.user?.nama}</div>
                        <div className="text-xs text-gray-400">NIM {p.user?.nim}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{p.jenisSurat}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGE[p.status]}`}>
                          {STATUS_LABEL[p.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => setOpenDropdown(openDropdown === p.id ? null : p.id)} 
                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <FiMoreVertical className="w-5 h-5" />
                          </button>
                          
                          {openDropdown === p.id && (
                            <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-10 animate-in fade-in zoom-in-95 duration-100">
                              <button 
                                onClick={() => { setModal(p); resetForms(); setOpenDropdown(null); }} 
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 flex items-center gap-2 transition-colors"
                              >
                                <FiEye className="w-4 h-4" /> Kelola
                              </button>
                            </div>
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

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={(e) => { if (e.target === e.currentTarget) setModal(null); }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-gray-900">Kelola Pengajuan</h3>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-600"><FiX className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-gray-500 mb-1">{modal.jenisSurat}</p>
            <p className="text-xs text-gray-400 mb-5">{modal.user?.nama} · {modal.user?.nim}</p>
            
            <div className="space-y-3 text-sm mb-5 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <Row label="Perusahaan" value={modal.namaPerusahaan} />
              <Row label="Alamat" value={modal.alamatPerusahaan} />
              <Row label="Keperluan" value={modal.keperluan} />
              <div className="flex justify-between pt-1">
                <span className="text-gray-500 shrink-0">File Pendukung</span>
                <span className="text-right">
                  {modal.filePendukung ? (
                    <a href={`${FILE_URL}${modal.filePendukung}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Lihat File</a>
                  ) : "-"}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-gray-500">Status Saat Ini</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[modal.status]}`}>
                  {STATUS_LABEL[modal.status]}
                </span>
              </div>
            </div>

            {/* Reject Form */}
            {showRejectForm ? (
              <div className="mb-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4 flex items-start gap-3">
                  <FiAlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-red-900">Konfirmasi Penolakan</h4>
                    <p className="text-xs text-red-700 mt-1">Pengajuan yang ditolak akan dikembalikan ke mahasiswa dan tidak dapat diproses lagi.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Alasan Penolakan <span className="text-red-500">*</span></label>
                    <textarea
                      rows={3}
                      value={alasanPenolakan}
                      onChange={(e) => setAlasanPenolakan(e.target.value)}
                      placeholder="Sebutkan alasan mengapa pengajuan ini ditolak..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdateStatus("DITOLAK")} disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 rounded-lg transition-colors disabled:opacity-50">Konfirmasi Tolak</button>
                    <button onClick={() => setShowRejectForm(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 rounded-lg transition-colors">Batal</button>
                  </div>
                </div>
              </div>
            ) : showFinishForm ? (
              <div className="space-y-4 mb-5 animate-in fade-in slide-in-from-top-2 duration-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Unggah Surat Selesai (.pdf/.doc)</label>
                  <input
                    type="file"
                    onChange={(e) => setFileSelesai(e.target.files[0])}
                    accept=".pdf,.doc,.docx"
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleUpdateStatus("SELESAI")} disabled={loading} className="flex-1 bg-green-600 text-white text-sm font-medium py-2 rounded-lg">Selesaikan & Kirim</button>
                  <button onClick={() => setShowFinishForm(false)} className="flex-1 bg-gray-100 text-gray-700 text-sm font-medium py-2 rounded-lg">Batal</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Catatan Admin <span className="text-gray-400 font-normal">(opsional)</span></label>
                  <textarea
                    rows={2}
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Tambahkan catatan tambahan..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {modal.status === "PENDING" && (
                    <button onClick={() => handleUpdateStatus("PROSES")} disabled={loading} className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2">
                      <FiCheck className="w-4 h-4" /> Verifikasi & Proses
                    </button>
                  )}
                  {modal.status === "PROSES" && (
                    <button onClick={() => setShowFinishForm(true)} disabled={loading} className="col-span-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2">
                      <FiCheck className="w-4 h-4" /> Selesaikan Pengajuan
                    </button>
                  )}
                  <button onClick={() => setShowRejectForm(true)} disabled={loading} className="col-span-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-2">
                    <FiX className="w-4 h-4" /> Tolak Pengajuan
                  </button>
                </div>
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
                    <p className="text-xs text-gray-500 mt-1">{formatDate(modal.createdAt)}</p>
                  </div>
                </div>
                {modal.updatedAt !== modal.createdAt && (
                  <div className="flex gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 leading-none">Terakhir Diperbarui</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(modal.updatedAt)}</p>
                    </div>
                  </div>
                )}
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
