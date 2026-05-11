import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="ADMIN" />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
