import { Link } from "react-router-dom";
import { useDashboardStats } from "./useDashboardStats";
import { FaTasks } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";

function TaskManagement() {
  const { total, pending, completed } = useDashboardStats();

  return (
    <>
      <h2 className="text-xl font-semibold mb-6">Dashboard</h2>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value={total} color="bg-blue-500" />
        <StatCard title="Pending Tasks" value={pending} color="bg-orange-500" />
        <StatCard
          title="Completed Tasks"
          value={completed}
          color="bg-green-500"
        />
      </div>

      {/* QUICK ACTIONS */}
      <div className="mt-10">
        <h3 className="text-sm font-semibold text-gray-500 mb-4">
          Quick actions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/alltasks"
            className="bg-white p-5 rounded-xl shadow flex items-center gap-4"
          >
            <FaTasks />
            <div>
              <h4 className="font-semibold">All Tasks</h4>
              <p className="text-sm text-gray-500">View and manage all tasks</p>
            </div>
          </Link>

          <Link
            to="/createtask"
            className="bg-white p-5 rounded-xl shadow flex items-center gap-4"
          >
            <IoAddCircleOutline size={22} />
            <div>
              <h4 className="font-semibold">Create Task</h4>
              <p className="text-sm text-gray-500">Create and assign tasks</p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

export default TaskManagement;

/* ---------------- STAT CARD ---------------- */

function StatCard({ title, value, color }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
      <div className={`h-2 mt-4 rounded ${color}`} />
    </div>
  );
}
