import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function DataMahasiswa() {
  const { user } = useAuth();
  const [mahasiswa, setMahasiswa] = useState([]);
  const [modal, setModal] = useState({
    show: false,
    isEdit: false,
    data: null,
  });
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    nama: "",
    email: "",
    nim: "",
    password: "",
    noHp: "",
    programStudi: "",
  });

  const fetchData = async () => {
    try {
      const res = await api.get("/admin/mahasiswa");
      setMahasiswa(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (isEdit, data = null) => {
    setModal({ show: true, isEdit, data });
    if (isEdit && data) {
      setForm({ ...data, password: "" });
    } else {
      setForm({
        nama: "",
        email: "",
        nim: "",
        password: "",
        noHp: "",
        programStudi: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal.isEdit) {
        await api.put(`/admin/mahasiswa/${modal.data.id}`, form);
      } else {
        await api.post("/admin/mahasiswa", form);
      }
      setModal({ show: false, isEdit: false, data: null });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Yakin ingin menghapus mahasiswa ini? Semua pengajuannya akan ikut terhapus.",
      )
    )
      return;
    try {
      await api.delete(`/admin/mahasiswa/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  const filtered = mahasiswa.filter(
    (m) =>
      m.nama.toLowerCase().includes(search.toLowerCase()) ||
      (m.nim && m.nim.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shrink-0">
        <h1 className="text-xl font-bold text-gray-900">
          Kelola Data Mahasiswa
        </h1>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{user?.nama}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <img
            src={`https://ui-avatars.com/api/?name=${user?.nama}&background=0D8ABC&color=fff`}
            alt="Profile"
            className="w-9 h-9 rounded-full"
          />
        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <input
              type="text"
              placeholder="Cari nama atau NIM..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
            <button
              onClick={() => openModal(false)}
              className="flex items-center gap-2 bg-[#0d1b3e] hover:bg-[#1a2f5e] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            >
              <FiPlus /> Tambah Mahasiswa
            </button>
          </div>

          <div className="overflow-x-auto">
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-sm">
                Data tidak ditemukan.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">
                      NIM
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">
                      Program Studi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m, i) => (
                    <tr
                      key={m.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-500">{i + 1}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {m.nim || "-"}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {m.nama}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{m.email}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {m.programStudi || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal(true, m)}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(m.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Hapus"
                          >
                            <FiTrash2 />
                          </button>
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

      {modal.show && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget)
              setModal({ show: false, isEdit: false, data: null });
          }}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900">
                {modal.isEdit ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
              </h3>
              <button
                onClick={() =>
                  setModal({ show: false, isEdit: false, data: null })
                }
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIM
                </label>
                <input
                  type="text"
                  value={form.nim}
                  onChange={(e) => setForm({ ...form, nim: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Studi
                </label>
                <select
                  value={form.programStudi}
                  onChange={(e) =>
                    setForm({ ...form, programStudi: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Program Studi</option>
                  <option value="D3 Teknik Komputer">D3 Teknik Komputer</option>
                  <option value="D4 Teknik Informatika">D4 Teknik Informatika</option>
                  <option value="D3 Teknik Listrik">D3 Teknik Listrik</option>
                  <option value="D4 Teknik Listrik">D4 Teknik Listrik</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {modal.isEdit && "(Isi jika ingin ganti)"}
                </label>
                <input
                  type="password"
                  required={!modal.isEdit}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#0d1b3e] hover:bg-[#1a2f5e] text-white font-medium px-4 py-2.5 rounded-lg transition-colors"
                >
                  {modal.isEdit ? "Simpan Perubahan" : "Tambahkan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
