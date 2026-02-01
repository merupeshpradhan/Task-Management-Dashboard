import { Link, useLocation } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FaTasks } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";

function Sidebar() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-blue-200 font-semibold"
      : "hover:bg-blue-100";

  return (
    <div className="w-[20vw] h-screen fixed left-0 top-0 bg-white border-r flex flex-col justify-between">
      {/* TOP */}
      <div>
        <h1 className="mt-4 ml-4 font-bold text-lg">
          Task Management
        </h1>

        <Link
          to="/taskmanagement"
          className={`mx-3 mt-6 flex items-center gap-3 p-2 rounded-lg ${isActive(
            "/taskmanagement"
          )}`}
        >
          <RxDashboard />
          Dashboard
        </Link>

        <Link
          to="/alltasks"
          className={`mx-3 mt-2 flex items-center gap-3 p-2 rounded-lg ${isActive(
            "/alltasks"
          )}`}
        >
          <FaTasks />
          Tasks
        </Link>
      </div>

      {/* LOGOUT */}
      <button className="m-4 flex items-center gap-2 text-red-500">
        <CiLogout />
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
