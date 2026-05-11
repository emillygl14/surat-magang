import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function Pengaturan() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    namaAplikasi: "Sistem Pengajuan Surat Magang",
    infoKontak: "",
  });
  const [logo, setLogo] = useState(null);
  const [currentLogo, setCurrentLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/admin/setting");
        if (res.data) {
          setForm({
            namaAplikasi: res.data.namaAplikasi || "Sistem Pengajuan Surat Magang",
            infoKontak: res.data.infoKontak || "",
          });
          setCurrentLogo(res.data.logoJurusan);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    setLoading(true);

    const formData = new FormData();
    formData.append("namaAplikasi", form.namaAplikasi);
    formData.append("infoKontak", form.infoKontak);
    if (logo) formData.append("logoJurusan", logo);

    try {
      const res = await api.put("/admin/setting", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setMsg({ type: "success", text: "Pengaturan berhasil disimpan!" });
      if (res.data.setting?.logoJurusan) setCurrentLogo(res.data.setting.logoJurusan);
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Gagal menyimpan pengaturan" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Pengaturan Sistem</h1>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{user?.nama}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <img src={`https://ui-avatars.com/api/?name=${user?.nama}&background=0D8ABC&color=fff`} alt="Profile" className="w-9 h-9 rounded-full" />
        </div>
      </header>

      <main className="flex-1 p-8 max-w-3xl mx-auto w-full">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Informasi Aplikasi</h3>
          
          {msg.text && (
            <div className={`mb-5 text-sm rounded-lg px-4 py-3 ${msg.type === "success" ? "text-green-700 bg-green-50 border border-green-200" : "text-red-700 bg-red-50 border border-red-200"}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden shrink-0">
                {logo ? (
                  <img src={URL.createObjectURL(logo)} alt="Logo Preview" className="w-full h-full object-contain" />
                ) : currentLogo ? (
                  <img src={`http://localhost:5000${currentLogo}`} alt="Current Logo" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-gray-400 text-xs text-center px-2">Belum ada logo</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo Jurusan/Institusi</label>
                <input type="file" onChange={(e) => setLogo(e.target.files[0])} accept="image/*" className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                <p className="text-xs text-gray-500 mt-1">Format: PNG, JPG, JPEG. Rekomendasi ukuran 200x200px.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Aplikasi</label>
                <input type="text" required value={form.namaAplikasi} onChange={(e) => setForm({ ...form, namaAplikasi: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Informasi Kontak Bantuan (Opsional)</label>
                <textarea rows={3} value={form.infoKontak} onChange={(e) => setForm({ ...form, infoKontak: e.target.value })} placeholder="Contoh: Email: admin@elektro.polindra.ac.id | WhatsApp: 08123456789" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                <p className="text-xs text-gray-500 mt-1">Akan ditampilkan di halaman panduan atau footer jika diperlukan.</p>
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={loading} className="w-full sm:w-auto bg-[#0d1b3e] hover:bg-[#1a2f5e] disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
                {loading ? "Menyimpan..." : "Simpan Pengaturan"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
