import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Layouts
import MahasiswaLayout from "./components/layouts/MahasiswaLayout";
import AdminLayout from "./components/layouts/AdminLayout";

// Mahasiswa Pages
import DashboardMahasiswa from "./pages/mahasiswa/Dashboard";
import PengajuanSuratMhs from "./pages/mahasiswa/PengajuanSurat";
import RiwayatPengajuanMhs from "./pages/mahasiswa/RiwayatPengajuan";
import ProfilMhs from "./pages/mahasiswa/Profil";
import PanduanMhs from "./pages/mahasiswa/Panduan";

// Admin Pages
import DashboardAdmin from "./pages/admin/Dashboard";
import PengajuanSuratAdmin from "./pages/admin/PengajuanSurat";
import VerifikasiSuratAdmin from "./pages/admin/VerifikasiSurat";
import DataMahasiswaAdmin from "./pages/admin/DataMahasiswa";
import DataSuratAdmin from "./pages/admin/DataSurat";
import LaporanAdmin from "./pages/admin/Laporan";
import PengaturanAdmin from "./pages/admin/Pengaturan";

function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        Memuat...
      </div>
    );
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/dashboard"} />;
  }
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user)
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/dashboard"} />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Dashboard Mahasiswa */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute role="MAHASISWA">
            <MahasiswaLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardMahasiswa />} />
        <Route path="pengajuan" element={<PengajuanSuratMhs />} />
        <Route path="riwayat" element={<RiwayatPengajuanMhs />} />
        <Route path="profil" element={<ProfilMhs />} />
        <Route path="panduan" element={<PanduanMhs />} />
      </Route>

      {/* Dashboard Admin */}
      <Route
        path="/admin"
        element={
          <PrivateRoute role="ADMIN">
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardAdmin />} />
        <Route path="pengajuan" element={<PengajuanSuratAdmin />} />
        <Route path="verifikasi" element={<VerifikasiSuratAdmin />} />
        <Route path="mahasiswa" element={<DataMahasiswaAdmin />} />
        <Route path="surat" element={<DataSuratAdmin />} />
        <Route path="laporan" element={<LaporanAdmin />} />
        <Route path="pengaturan" element={<PengaturanAdmin />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
