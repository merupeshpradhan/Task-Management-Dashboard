import { useEffect, useState } from "react";
import api from "../../Api/api";
import { FaTasks } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";

/* ===============================
   DASHBOARD COMPONENT
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

  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "pending",
  });
  const [users, setUsers] = useState([]);

  /* ===============================
     FETCH STATS
  ================================ */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const url = isAdmin ? "/tasks" : "/tasks/my-tasks";
        const res = await api.get(url);
        const tasks = res.data.data;

        setStats({
          total: tasks.length,
          pending: tasks.filter((t) => t.status === "pending").length,
          inProgress: tasks.filter((t) => t.status === "in-progress").length,
          completed: tasks.filter((t) => t.status === "completed").length,
        });
      } catch (err) {
        console.error("Fetch stats error:", err);
      }
    };

    fetchStats();
  }, [isAdmin]);

  /* ===============================
     FETCH USERS (for task assignment)
  ================================ */
  useEffect(() => {
    if (!isAdmin) return;
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data.data || []);
      } catch (err) {
        console.error("Fetch users error:", err);
      }
    };
    fetchUsers();
  }, [isAdmin]);

  /* ===============================
     HANDLE CREATE TASK
  ================================ */
  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.assignedTo) {
      return alert("Please fill title and select a user");
    }

    try {
      await api.post("/tasks", newTask);
      alert("Task created successfully!");
      setNewTask({
        title: "",
        description: "",
        assignedTo: "",
        status: "pending",
      });
      setShowCreatePanel(false);
    } catch (err) {
      console.error("Create task failed:", err);
      alert("Failed to create task");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Dashboard</h2>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="My Tasks" value={stats.total} color="bg-blue-500" />
        <StatCard
          title="Pending Tasks"
          value={stats.pending}
          color="bg-orange-500"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          color="bg-purple-500"
        />
        <StatCard
          title="Completed Tasks"
          value={stats.completed}
          color="bg-green-500"
        />
      </div>

      {/* ===== ADMIN QUICK ACTIONS ===== */}
      {isAdmin && (
        <>
          <h3 className="text-sm font-semibold text-gray-500 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className="bg-white p-5 rounded-xl shadow flex items-center gap-4 cursor-pointer"
              onClick={() => setShowCreatePanel(false)}
            >
              <FaTasks size={22} />
              <div>
                <h4 className="font-semibold">All Tasks</h4>
                <p className="text-sm text-gray-500">
                  View and manage all tasks
                </p>
              </div>
            </div>

            <button
              className="bg-white p-5 rounded-xl shadow flex items-center gap-4"
              onClick={() => setShowCreatePanel(true)}
            >
              <IoAddCircleOutline size={22} />
              <div>
                <h4 className="font-semibold">Create Task</h4>
                <p className="text-sm text-gray-500">Create and assign tasks</p>
              </div>
            </button>
          </div>
        </>
      )}

      {/* ===== USER TASK VIEW ===== */}
      {!isAdmin && (
        <div className="mt-10">
          <h3 className="font-semibold mb-4">My Tasks</h3>
          <UserTaskTable />
        </div>
      )}

      {/* ===============================
          CREATE TASK PANEL (RIGHT SIDE)
      ================================ */}
      {showCreatePanel && (
        <div className="fixed inset-0 z-50 flex">
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowCreatePanel(false)}
          />

          {/* Right side panel */}
          <div className="ml-auto w-[400px] bg-white h-full p-6 shadow-xl overflow-y-auto relative">
            <button
              onClick={() => setShowCreatePanel(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-lg font-bold"
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold mb-4">Create Task</h3>

            <input
              type="text"
              placeholder="Title"
              className="w-full border p-2 rounded mb-2"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              className="w-full border p-2 rounded mb-2"
              rows={3}
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />

            <select
              className="w-full border p-2 rounded mb-3"
              value={newTask.assignedTo}
              onChange={(e) =>
                setNewTask({ ...newTask, assignedTo: e.target.value })
              }
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.fullName}
                </option>
              ))}
            </select>

            <button
              onClick={handleCreateTask}
              className="w-full bg-blue-600 text-white py-2 rounded mb-2"
            >
              Create Task
            </button>

            <button
              onClick={() => setShowCreatePanel(false)}
              className="w-full border py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskManagement;

/* ===============================
   STAT CARD COMPONENT
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

/* ===============================
   USER TASK TABLE
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdate = async () => {
    try {
      await api.put(`/tasks/${selectedTask._id}`, { status: editData.status });
      setIsEditing(false);
      setSelectedTask(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to update task");
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
                  <td className="p-3 text-center">
                    {task.createdBy?.fullName || "-"}
                  </td>
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
        <div className="relative w-[360px] bg-white rounded-xl shadow p-4">
          <button
            onClick={() => {
              setSelectedTask(null);
              setIsEditing(false);
            }}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-lg font-bold"
          >
            ✕
          </button>

          <h3 className="font-semibold mb-2">{selectedTask.title}</h3>
          <p className="text-sm text-gray-600 mb-3">
            {selectedTask.description || "No description"}
          </p>

          <label className="block mb-2 font-semibold">Update Status</label>
          <select
            className="w-full border p-2 rounded mb-3"
            value={editData.status}
            onChange={(e) =>
              setEditData({ ...editData, status: e.target.value })
            }
          >
            <option value="pending">Pending</option>
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
