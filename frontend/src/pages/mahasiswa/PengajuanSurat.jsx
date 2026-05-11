import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api, { FILE_URL } from "../../services/api";

export default function PengajuanSurat() {
  const { user } = useAuth();
  const [jenisList, setJenisList] = useState([]);
  const [form, setForm] = useState({
    jenisSurat: "",
    namaPerusahaan: "",
    alamatPerusahaan: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    keperluan: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Admin jenis surat endpoint can be public or we can just fetch it if token exists
    // Tapi kita butuh endpoint public atau mahasiswa bisa akses jenis surat.
    // Sementara kita hardcode atau fetch dari admin (butuh update route admin/jenis-surat agar bs diakses mahasiswa atau bikin route baru).
    // Let's hardcode first, or we can use a hardcoded fallback if API fails.
    const fetchJenis = async () => {
      try {
        const res = await api.get("/admin/jenis-surat");
        setJenisList(res.data);
        if (res.data.length > 0) setForm(f => ({ ...f, jenisSurat: res.data[0].nama }));
      } catch (err) {
        // Fallback if mahasiswa cannot access /admin/jenis-surat
        const fallback = ["Surat Permohonan Magang", "Surat Pengantar Magang", "Surat Keterangan Aktif"];
        setJenisList(fallback.map(f => ({ nama: f })));
        setForm(f => ({ ...f, jenisSurat: fallback[0] }));
      }
    };
    fetchJenis();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (file) {
      formData.append("filePendukung", file);
    }

    try {
      await api.post("/pengajuan", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess("Pengajuan berhasil dikirim!");
      setForm({
        ...form,
        namaPerusahaan: "",
        alamatPerusahaan: "",
        tanggalMulai: "",
        tanggalSelesai: "",
        keperluan: "",
      });
      setFile(null);
      // Reset file input visually
      document.getElementById('fileUpload').value = "";
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengirim pengajuan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Buat Pengajuan Surat</h1>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{user?.nama}</p>
            <p className="text-xs text-gray-500">{user?.nim}</p>
          </div>
          <img src={user?.fotoProfil ? `${FILE_URL}${user.fotoProfil}` : `https://ui-avatars.com/api/?name=${user?.nama}`} alt="Profile" className="w-9 h-9 rounded-full object-cover" />
        </div>
      </header>

      <main className="flex-1 p-8 max-w-4xl mx-auto w-full">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Form Pengajuan Surat Magang</h3>
          
          {success && <div className="mb-5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">{success}</div>}
          {error && <div className="mb-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Surat</label>
              <select
                value={form.jenisSurat}
                onChange={(e) => setForm({ ...form, jenisSurat: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {jenisList.map((j, i) => (
                  <option key={i} value={j.nama}>{j.nama}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan/Instansi Tujuan</label>
                <input type="text" required value={form.namaPerusahaan} onChange={(e) => setForm({ ...form, namaPerusahaan: e.target.value })} placeholder="PT. Contoh Indonesia" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Perusahaan</label>
                <input type="text" required value={form.alamatPerusahaan} onChange={(e) => setForm({ ...form, alamatPerusahaan: e.target.value })} placeholder="Jl. Contoh No. 1, Kota" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai Magang</label>
                <input type="date" required value={form.tanggalMulai} onChange={(e) => setForm({ ...form, tanggalMulai: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai Magang</label>
                <input type="date" required value={form.tanggalSelesai} onChange={(e) => setForm({ ...form, tanggalSelesai: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Keperluan</label>
              <textarea required rows={3} value={form.keperluan} onChange={(e) => setForm({ ...form, keperluan: e.target.value })} placeholder="Jelaskan keperluan magang secara singkat..." className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload File Pendukung (Opsional)</label>
              <input id="fileUpload" type="file" onChange={(e) => setFile(e.target.files[0])} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              <p className="text-xs text-gray-500 mt-1">Format: PDF, DOC, DOCX, PNG, JPG (Max: 5MB). Contoh: Surat penerimaan magang jika sudah ada.</p>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={loading} className="w-full bg-[#0d1b3e] hover:bg-[#1a2f5e] disabled:opacity-60 text-white font-medium px-5 py-3 rounded-lg transition-colors">
                {loading ? "Mengirim Pengajuan..." : "Kirim Pengajuan"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
