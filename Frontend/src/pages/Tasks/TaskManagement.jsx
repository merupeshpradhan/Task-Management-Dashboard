import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { RxDashboard } from "react-icons/rx";
import { FaTasks } from "react-icons/fa";

function TaskManagement() {
  return (
    <div className="flex">
      <div className="w-[25vw] h-[99.9vh] border-r border-gray-300">
        <h1 className="mt-4 ml-3 font-bold text-md tracking-wider text-[#444944]">
          Task Management
        </h1>
        <div className="mt-5">
          <Link
            to="/taskmanagement"
            className="w-[90%] flex items-center gap-3 bg-blue-100 p-1.5 rounded-lg"
          >
            <RxDashboard />
            <p>Dashboard</p>
          </Link>
        </div>
        <div className="mt-2">
          <Link
            to="/taskmanagement"
            className="w-[90%] flex items-center gap-3 bg-blue-100 p-1.5 rounded-lg"
          >
            <FaTasks />
            <p>Tasks</p>
          </Link>
        </div>
      </div>
      <div className="w-full">
        <Navbar />
        <hr className="border-gray-300" />
      </div>
    </div>
  );
}

export default TaskManagement;
