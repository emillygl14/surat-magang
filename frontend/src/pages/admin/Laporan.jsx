import React, { useState, useEffect } from "react";
import { FiDownload } from "react-icons/fi";
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

export default function Laporan() {
  const { user } = useAuth();
  const [pengajuan, setPengajuan] = useState([]);
  const [filter, setFilter] = useState({
    startDate: "",
    endDate: "",
    status: "",
  });

  const fetchData = async () => {
    try {
      let query = "?";
      if (filter.startDate) query += `startDate=${filter.startDate}&`;
      if (filter.endDate) query += `endDate=${filter.endDate}&`;
      if (filter.status) query += `status=${filter.status}`;
      
      const res = await api.get(`/admin/laporan${query}`);
      setPengajuan(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 h-16 flex items-center justify-between shrink-0 print:hidden">
        <h1 className="text-xl font-bold text-gray-900">Laporan Pengajuan</h1>
        <div className="flex items-center gap-3">
          <div className="text-right leading-tight">
            <p className="text-sm font-semibold text-gray-900">{user?.nama}</p>
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Administrator</p>
          </div>
          <img src={`https://ui-avatars.com/api/?name=${user?.nama}&background=0D8ABC&color=fff`} alt="Profile" className="w-9 h-9 rounded-full border border-gray-100" />
        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm print:border-none print:shadow-none">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:justify-between md:items-center gap-4 print:hidden">
            <div className="flex gap-3 items-center">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Dari Tanggal</label>
                <input type="date" value={filter.startDate} onChange={(e) => setFilter({...filter, startDate: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Sampai Tanggal</label>
                <input type="date" value={filter.endDate} onChange={(e) => setFilter({...filter, endDate: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Status</label>
                <select value={filter.status} onChange={(e) => setFilter({...filter, status: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none bg-white">
                  <option value="">Semua Status</option>
                  <option value="PENDING">Diproses</option>
                  <option value="DISETUJUI">Disetujui</option>
                  <option value="DITOLAK">Ditolak</option>
                </select>
              </div>
              <div className="self-end pb-0.5">
                 <button onClick={() => setFilter({startDate:"", endDate:"", status:""})} className="text-xs text-blue-600 hover:underline">Reset</button>
              </div>
            </div>
            <button onClick={handlePrint} className="flex items-center gap-2 bg-[#0d1b3e] hover:bg-[#1a2f5e] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
              <FiDownload /> Export PDF
            </button>
          </div>

          <div className="hidden print:block px-6 py-4 border-b border-gray-900 text-center mb-4">
            <h2 className="text-2xl font-bold">Laporan Pengajuan Surat Magang</h2>
            <p className="text-sm">Jurusan Teknik Elektro Politeknik Negeri Manado</p>
          </div>

          <div className="overflow-x-auto print:overflow-visible">
            {pengajuan.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-sm">Tidak ada data untuk laporan ini.</div>
            ) : (
              <table className="w-full text-sm print:text-xs print:border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50 print:bg-transparent print:border-b-2 print:border-gray-800">
                    <th className="px-6 py-3 text-left font-semibold text-gray-500 print:text-black print:border print:border-gray-300">No</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-500 print:text-black print:border print:border-gray-300">Nama Mahasiswa</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-500 print:text-black print:border print:border-gray-300">NIM</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-500 print:text-black print:border print:border-gray-300">Jenis Surat</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-500 print:text-black print:border print:border-gray-300">Tanggal Mulai</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-500 print:text-black print:border print:border-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pengajuan.map((p, i) => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors print:hover:bg-transparent">
                      <td className="px-6 py-4 print:py-2 text-gray-500 print:text-black print:border print:border-gray-300">{i + 1}</td>
                      <td className="px-6 py-4 print:py-2 font-medium text-gray-900 print:border print:border-gray-300">{p.user?.nama}</td>
                      <td className="px-6 py-4 print:py-2 text-gray-600 print:text-black print:border print:border-gray-300">{p.user?.nim || "-"}</td>
                      <td className="px-6 py-4 print:py-2 text-gray-600 print:text-black print:border print:border-gray-300">{p.jenisSurat}</td>
                      <td className="px-6 py-4 print:py-2 text-gray-600 print:text-black print:border print:border-gray-300">{formatDate(p.tanggalMulai)}</td>
                      <td className="px-6 py-4 print:py-2 print:border print:border-gray-300">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGE[p.status]} print:bg-transparent print:border-none print:text-black print:p-0`}>
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
