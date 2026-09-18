import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-text">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
      />
      <main
        className={`${
          collapsed ? "ml-16" : "ml-60"
        } min-h-screen transition-all duration-300 px-4 py-6 sm:px-6 lg:px-8`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
