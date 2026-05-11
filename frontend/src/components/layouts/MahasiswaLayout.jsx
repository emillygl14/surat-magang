import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import Sidebar from "../Sidebar";

export default function MahasiswaLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        role="MAHASISWA"
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative">
        {/* Mobile Header Toggle */}
        <div className="lg:hidden flex items-center bg-white px-4 py-3 border-b border-gray-200 sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          <span className="ml-3 font-bold text-[#0d1b3e] uppercase tracking-wider text-sm">
            Mahasiswa Portal
          </span>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
