import { Link, useLocation, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FaTasks } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import api from "../Api/api"; // adjust path

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // 🔑 GET USER
  const user = JSON.parse(localStorage.getItem("user"));

  const isActive = (path) =>
    location.pathname === path
      ? "bg-pink-200 font-semibold"
      : "hover:bg-pink-100";

  // --------------------
  // LOGOUT HANDLER
  // --------------------
  const handleLogout = async () => {
  try {
    await api.post("/users/logout");

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");

    navigate("/signin", { replace: true });
    window.location.reload(); // 🔥 ensures clean UI reset
  } catch (error) {
    console.error(
      "Logout failed:",
      error?.response?.data || error.message
    );
  }
};
  return (
    <div className="w-[20vw] h-screen fixed left-0 top-0 bg-white border-r flex flex-col justify-between">
      {/* TOP */}
      <div>
        <h1 className="mt-4 ml-4 font-bold text-lg">
          Task Management
        </h1>

        {/* DASHBOARD (ADMIN + USER) */}
        <Link
          to={user?.role === "admin" ? "/taskmanagement" : "/taskmanagement"}
          className={`mx-3 mt-6 flex items-center gap-3 p-2 rounded-lg ${isActive(
            user?.role === "admin" ? "/taskmanagement" : "/taskmanagement"
          )}`}
        >
          <RxDashboard />
          Dashboard
        </Link>

        {/* TASKS (ADMIN ONLY) */}
        {user?.role === "admin" && (
          <Link
            to="/alltasks"
            className={`mx-3 mt-2 flex items-center gap-3 p-2 rounded-lg ${isActive(
              "/alltasks"
            )}`}
          >
            <FaTasks />
            Tasks
          </Link>
        )}
      </div>

      {/* LOGOUT (ADMIN + USER) */}
      <button
        onClick={handleLogout}
        className="m-4 flex items-center gap-2 p-2 text-red-500 hover:bg-red-100 rounded-lg"
      >
        <CiLogout />
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
