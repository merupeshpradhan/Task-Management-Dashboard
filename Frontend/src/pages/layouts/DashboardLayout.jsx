import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-[20vw] w-[80vw] min-h-screen bg-gray-100">
        <Navbar />
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
