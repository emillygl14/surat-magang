import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function Panduan() {
  const { user } = useAuth();

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shrink-0">
        <h1 className="text-xl font-bold text-gray-900">Panduan Magang</h1>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{user?.nama}</p>
            <p className="text-xs text-gray-500">{user?.nim}</p>
          </div>
          <img src={user?.fotoProfil ? `http://localhost:5000${user.fotoProfil}` : `https://ui-avatars.com/api/?name=${user?.nama}`} alt="Profile" className="w-9 h-9 rounded-full object-cover" />
        </div>
      </header>

      <main className="flex-1 p-8 max-w-4xl mx-auto w-full">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#0d1b3e] mb-6 text-center">Prosedur Magang Industri</h2>
          <p className="text-gray-600 mb-8 text-center">Berikut adalah prosedur resmi yang harus diikuti oleh seluruh mahasiswa Jurusan Teknik Elektro.</p>

          <div className="space-y-4">
            {[
              "Mahasiswa mencari tempat magang secara mandiri.",
              "Setelah mendapatkan calon perusahaan/instansi, mahasiswa mengirimkan nama tempat magang tersebut kepada panitia melalui sistem ini.",
              "Panitia akan membuatkan surat permohonan magang.",
              "Mahasiswa mengambil atau menerima surat permohonan tersebut dari panitia.",
              "Mahasiswa membawa dan menyerahkan surat permohonan ke perusahaan/instansi tujuan.",
              "Setelah itu, mahasiswa menunggu surat balasan resmi dari perusahaan/instansi.",
              "Jika surat balasan menyatakan diterima, mahasiswa segera melaporkannya kepada panitia untuk proses selanjutnya.",
              "Jika belum diterima, mahasiswa dapat mencari tempat magang lain dan mengajukan kembali melalui prosedur yang sama."
            ].map((text, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all">
                <div className="w-8 h-8 shrink-0 bg-blue-100 text-blue-600 font-bold rounded-full flex items-center justify-center">
                  {i + 1}
                </div>
                <p className="text-gray-700 pt-1 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-sm text-yellow-800 font-medium">
              Mohon seluruh mahasiswa mengikuti prosedur ini dengan tertib agar proses administrasi magang dapat berjalan dengan baik. Terima kasih.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
