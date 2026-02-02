import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../Api/api";
import { FaTasks } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";

/* ===============================
   DASHBOARD
================================ */
function TaskManagement() {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const url = isAdmin ? "/tasks" : "/tasks/my-tasks";
      const res = await api.get(url);
      const tasks = res.data.data;

      setStats({
        total: tasks.length,
        pending: tasks.filter((t) => t.status === "pending").length,
        inProgress: tasks.filter((t) => t.status === "in-progress").length,
        completed: tasks.filter((t) => t.status === "completed").length,
      });
    };

    fetchStats();
  }, [isAdmin]);

  return (
    <>
      <h2 className="text-xl font-semibold mb-6">Dashboard</h2>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="My Tasks" value={stats.total} color="bg-blue-500" />
        <StatCard title="Pending Tasks" value={stats.pending} color="bg-orange-500" />
        <StatCard title="In Progress" value={stats.inProgress} color="bg-purple-500" />
        <StatCard title="Completed Tasks" value={stats.completed} color="bg-green-500" />
      </div>

      {/* ===== USER VIEW ===== */}
      {!isAdmin && (
        <div className="mt-10">
          <h3 className="font-semibold mb-4">My Tasks</h3>
          <UserTaskTable />
        </div>
      )}

      {/* ===== ADMIN VIEW ===== */}
      {isAdmin && (
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
      )}
    </>
  );
}

export default TaskManagement;

/* ===============================
   USER TASK TABLE WITH EDIT
================================ */
function UserTaskTable() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ status: "pending" });

  const getTaskCode = (id) => `#TSK${id.slice(-3).toUpperCase()}`;

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks/my-tasks");
      setTasks(res.data.data || []);
    } catch (err) {
      console.error("Fetch tasks error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdate = async () => {
    try {
      const payload = { status: editData.status };
      await api.put(`/tasks/${selectedTask._id}`, payload);

      setIsEditing(false);
      setSelectedTask(null);
      fetchTasks();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update task. Please try again.");
    }
  };

  if (loading) return <p className="p-4">Loading tasks...</p>;

  return (
    <div className="flex gap-6">
      {/* TASK TABLE */}
      <div className="flex-1 bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Task ID</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-center">Assigned By</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Created On</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No tasks found
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-semibold">{getTaskCode(task._id)}</td>
                  <td className="p-3">{task.title}</td>
                  <td className="p-3 text-center">{task.createdBy?.fullName || "-"}</td>
                  <td className="p-3 text-center capitalize">{task.status}</td>
                  <td className="p-3 text-center">
                    {new Date(task.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => {
                        setSelectedTask(task);
                        setIsEditing(true);
                        setEditData({ status: task.status });
                      }}
                      className="px-3 py-1 bg-indigo-600 text-white rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT PANEL */}
      {selectedTask && isEditing && (
        <div className="w-[360px] bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-2">{selectedTask.title}</h3>
          <p className="text-sm text-gray-600 mb-3">
            {selectedTask.description || "No description"}
          </p>

          <label className="block mb-2 font-semibold">Update Status</label>
          <select
            className="w-full border p-2 rounded mb-3"
            value={editData.status}
            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <button
            onClick={handleUpdate}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Save Status
          </button>

          <button
            onClick={() => {
              setIsEditing(false);
              setSelectedTask(null);
            }}
            className="w-full border py-2 rounded mt-2"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

/* ===============================
   STAT CARD
================================ */
function StatCard({ title, value, color }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
      <div className={`h-2 mt-4 rounded ${color}`} />
    </div>
  );
}
