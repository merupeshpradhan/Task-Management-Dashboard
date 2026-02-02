import { useEffect, useState } from "react";
import api from "../Api/api";

/* ===============================
   HELPERS
================================ */
const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getTaskCode = (id) => `#TSK${id.slice(-3).toUpperCase()}`;

/* ===============================
   COMPONENT
================================ */
const AllTasks = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  /* STATES */
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState("all");

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  // Create Task modal
  const [showCreate, setShowCreate] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "pending",
  });

  // Users for assignment
  const [users, setUsers] = useState([]);

  /* ===============================
     FETCH TASKS & USERS
  ================================ */
  const fetchTasks = async () => {
    try {
      const res = isAdmin
        ? await api.get("/tasks")
        : await api.get("/my-tasks");
      setTasks(res.data?.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Fetch tasks error:", err);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      if (!isAdmin) return;
      const res = await api.get("/users");
      setUsers(res.data?.data || []);
    } catch (err) {
      console.error("Fetch users error:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  /* ===============================
     FILTER TASKS
  ================================ */
  useEffect(() => {
    let temp = [...tasks];
    if (filterStatus !== "all")
      temp = temp.filter((t) => t.status === filterStatus);
    setFilteredTasks(temp);
  }, [tasks, filterStatus]);

  /* ===============================
     UPDATE TASK
  ================================ */
  const handleUpdate = async () => {
    try {
      const payload =
        isAdmin || selectedTask.assignedTo?._id === user._id
          ? isAdmin
            ? editData
            : { status: editData.status }
          : null;

      if (!payload) return;

      const res = await api.put(`/tasks/${selectedTask._id}`, payload);
      const updatedTask = res.data.data;

      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );

      setIsEditing(false);
      setSelectedTask(null);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update task");
    }
  };

  /* ===============================
     DELETE TASK
  ================================ */
  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm("Delete this task?")) return;

    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      setSelectedTask(null);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete task");
    }
  };

  /* ===============================
     CREATE TASK
  ================================ */
  const handleCreate = async () => {
    if (!newTask.title || !newTask.assignedTo) {
      return alert("Please fill title and select a user");
    }

    try {
      const res = await api.post("/tasks", newTask);
      const createdTask = res.data.data;

      setTasks((prev) => [createdTask, ...prev]);
      setShowCreate(false);
      setNewTask({ title: "", description: "", assignedTo: "", status: "pending" });
    } catch (err) {
      console.error("Create task failed:", err);
      alert("Failed to create task");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      {/* TOP BAR: FILTERS + CREATE BUTTON */}
      <div className="flex justify-between items-center mb-4">
        {/* FILTER BUTTONS */}
        <div className="flex gap-2">
          {["all", "pending", "in-progress", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1 rounded ${
                filterStatus === status
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* CREATE TASK BUTTON (RIGHT) */}
        {isAdmin && (
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-1 bg-blue-600 text-white rounded"
          >
            + Create Task
          </button>
        )}
      </div>

      {/* TASK TABLE + RIGHT PANEL */}
      <div className="flex gap-6">
        {/* TASK TABLE */}
        <div className="flex-1 bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Task ID</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-center">Assigned To</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Created</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500">
                    No tasks found
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task._id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold">{getTaskCode(task._id)}</td>
                    <td className="p-3">{task.title}</td>
                    <td className="p-3 text-center">{task.assignedTo?.fullName || "-"}</td>
                    <td className="p-3 text-center capitalize">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          task.status === "pending"
                            ? "bg-orange-100 text-orange-600"
                            : task.status === "in-progress"
                              ? "bg-purple-100 text-purple-600"
                              : "bg-green-100 text-green-600"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">{formatDate(task.createdAt)}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setIsEditing(false);
                        }}
                        className="px-3 py-1 bg-indigo-600 text-white rounded mr-1"
                      >
                        View
                      </button>
                      {(isAdmin || task.assignedTo?._id === user._id) && (
                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            setIsEditing(true);
                            setEditData({
                              title: task.title,
                              description: task.description || "",
                              status: task.status,
                            });
                          }}
                          className="px-3 py-1 bg-green-600 text-white rounded"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* RIGHT PANEL */}
        {selectedTask && (
          <div className="w-[360px] bg-white rounded-xl shadow p-4 relative">
            {/* CLOSE BUTTON */}
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

            {isEditing ? (
              <>
                {isAdmin && (
                  <>
                    <input
                      className="w-full border p-2 rounded mb-2"
                      value={editData.title}
                      onChange={(e) =>
                        setEditData({ ...editData, title: e.target.value })
                      }
                    />
                    <textarea
                      className="w-full border p-2 rounded mb-2"
                      rows="3"
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({ ...editData, description: e.target.value })
                      }
                    />
                  </>
                )}

                {(isAdmin || selectedTask.assignedTo?._id === user._id) && (
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
                )}

                <button
                  onClick={handleUpdate}
                  className="w-full bg-green-600 text-white py-2 rounded"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-3">
                  {selectedTask.description || "No description"}
                </p>

                <p className="text-sm mb-2 capitalize">
                  <b>Status:</b> {selectedTask.status}
                </p>

                {(isAdmin || selectedTask.assignedTo?._id === user._id) && (
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditData({
                        title: selectedTask.title,
                        description: selectedTask.description || "",
                        status: selectedTask.status,
                      });
                    }}
                    className="w-full border py-2 rounded mt-3"
                  >
                    Edit
                  </button>
                )}

                {isAdmin && (
                  <button
                    onClick={() => handleDelete(selectedTask._id)}
                    className="w-full bg-red-600 text-white py-2 rounded mt-2"
                  >
                    Delete
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* CREATE TASK MODAL */}
      {showCreate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl w-[400px] shadow relative">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowCreate(false)}
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
              rows="3"
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

            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="flex-1 bg-blue-600 text-white py-2 rounded"
              >
                Create
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 border py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTasks;
