import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
      />
      <main
        className={`${
          collapsed ? "ml-16" : "ml-60"
        } transition-all duration-300 p-6`}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
