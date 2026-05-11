import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiFileText,
  FiClock,
  FiUser,
  FiHelpCircle,
  FiCheckSquare,
  FiUsers,
  FiFolder,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const mahasiswaMenu = [
  { icon: FiHome, label: "Dashboard", path: "/dashboard" },
  { icon: FiFileText, label: "Pengajuan Surat", path: "/dashboard/pengajuan" },
  { icon: FiClock, label: "Riwayat Pengajuan", path: "/dashboard/riwayat" },
  { icon: FiUser, label: "Profil", path: "/dashboard/profil" },
  { icon: FiHelpCircle, label: "Panduan", path: "/dashboard/panduan" },
];

const adminMenu = [
  { icon: FiHome, label: "Dashboard", path: "/admin" },
  { icon: FiFileText, label: "Pengajuan Surat", path: "/admin/pengajuan" },
  { icon: FiCheckSquare, label: "Verifikasi Surat", path: "/admin/verifikasi" },
  { icon: FiUsers, label: "Data Mahasiswa", path: "/admin/mahasiswa" },
  { icon: FiFolder, label: "Data Surat", path: "/admin/surat" },
  { icon: FiBarChart2, label: "Laporan", path: "/admin/laporan" },
  { icon: FiSettings, label: "Pengaturan", path: "/admin/pengaturan" },
];

export default function Sidebar({ role, isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const menu = role === "ADMIN" ? adminMenu : mahasiswaMenu;
  const basePath = role === "ADMIN" ? "/admin" : "/dashboard";

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#0d1b3e] flex flex-col shrink-0 z-50 transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo & Close Button */}
        <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <span className="text-gray-400 text-[9px] tracking-widest uppercase block mb-0.5">
              Polindra
            </span>
            <span className="text-white font-black text-xl tracking-tight">
              ELE<span className="text-red-500">/</span>TRO
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {menu.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === basePath}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                  isActive
                    ? "bg-blue-700 text-white font-medium"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 p-4">
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex items-center gap-3 text-gray-400 hover:text-white text-sm w-full py-2 px-1 transition-colors"
          >
            <FiLogOut className="w-4 h-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
