import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api, { FILE_URL } from "../../services/api";

export default function Profil() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    nama: "",
    email: "",
    nim: "",
    noHp: "",
    programStudi: "",
    password: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setForm({
        nama: user.nama || "",
        email: user.email || "",
        nim: user.nim || "",
        noHp: user.noHp || "",
        programStudi: user.programStudi || "",
        password: "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    setLoading(true);

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) formData.append(key, form[key]);
    });
    if (file) formData.append("fotoProfil", file);

    try {
      const res = await api.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMsg({ type: "success", text: "Profil berhasil diperbarui!" });
      updateUser(res.data.user);
      setForm((prev) => ({ ...prev, password: "" }));
      setFile(null);
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Gagal memperbarui profil",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 h-16 flex items-center justify-between shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Profil Saya</h1>
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

      <main className="flex-1 p-8 max-w-3xl mx-auto w-full">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Edit Profil</h3>
          
          {msg.text && (
            <div className={`mb-5 text-sm rounded-lg px-4 py-3 ${msg.type === "success" ? "text-green-700 bg-green-50 border border-green-200" : "text-red-700 bg-red-50 border border-red-200"}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src={file ? URL.createObjectURL(file) : (user?.fotoProfil ? `${FILE_URL}${user.fotoProfil}` : `https://ui-avatars.com/api/?name=${user?.nama}&background=0D8ABC&color=fff`)} 
                alt="Profile Preview" 
                className="w-20 h-20 rounded-full object-cover border border-gray-200 shadow-sm" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${user?.nama}&background=0D8ABC&color=fff`;
                }}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ganti Foto Profil</label>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} accept="image/*" className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input type="text" required value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIM</label>
                <input type="text" value={form.nim} onChange={(e) => setForm({ ...form, nim: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nomor HP</label>
                <input type="text" value={form.noHp} onChange={(e) => setForm({ ...form, noHp: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Program Studi</label>
                <select value={form.programStudi} onChange={(e) => setForm({ ...form, programStudi: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Pilih Program Studi</option>
                  <option value="D3 Teknik Komputer">D3 Teknik Komputer</option>
                  <option value="D4 Teknik Informatika">D4 Teknik Informatika</option>
                  <option value="D3 Teknik Listrik">D3 Teknik Listrik</option>
                  <option value="D4 Teknik Listrik">D4 Teknik Listrik</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru (Opsional)</label>
                <input type="password" placeholder="Kosongkan jika tidak ingin ganti" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={loading} className="w-full sm:w-auto bg-[#0d1b3e] hover:bg-[#1a2f5e] disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
