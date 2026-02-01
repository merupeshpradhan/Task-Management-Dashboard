import { Link, useLocation, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FaTasks } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import api from "../pages/Api/api";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-blue-200 font-semibold"
      : "hover:bg-blue-100";

  // --------------------
  // LOGOUT HANDLER
  // --------------------
  const handleLogout = async () => {
    try {
      // call backend logout
      await api.post("/users/logout");

      // clear frontend storage
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");

      // notify navbar to update user
      window.dispatchEvent(new Event("userUpdated"));

      // redirect to signin
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
      <button
        onClick={handleLogout}
        className="m-4 flex items-center gap-2 p-2 text-red-500 hover:text-red-600 hover:bg-red-100 rounded-lg cursor-pointer"
      >
        <CiLogout />
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
