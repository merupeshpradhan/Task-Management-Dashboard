// ===============================
// IMPORTS
// ===============================
import { useEffect, useState } from "react";
import api from "../Api/api";

// ===============================
// COMPONENT
// ===============================
function AllTasks() {
  // ===============================
  // STATES
  // ===============================
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // create task modal
  const [openModal, setOpenModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // task details (right panel)
  const [selectedTask, setSelectedTask] = useState(null);

  // update status modal
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // edit task modal
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAssignedTo, setEditAssignedTo] = useState("");

  // ===============================
  // FETCH TASKS
  // ===============================
  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data.data);
    } catch (error) {
      console.error("Fetch tasks failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ===============================
  // FETCH USERS
  // ===============================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data.data);
      } catch (error) {
        console.error("Fetch users failed", error);
      }
    };
    fetchUsers();
  }, []);

  // ===============================
  // FILTER TASKS
  // ===============================
  const filteredTasks =
    filter === "all"
      ? tasks
      : tasks.filter((task) => task.status === filter);

  // ===============================
  // CREATE TASK
  // ===============================
  const handleCreateTask = async () => {
    if (!title || !assignedTo) {
      alert("Title and Assigned User are required");
      return;
    }

    try {
      await api.post("/tasks", {
        title,
        description,
        assignedTo,
      });

      setOpenModal(false);
      setTitle("");
      setDescription("");
      setAssignedTo("");
      fetchTasks();
    } catch (error) {
      console.error("Create task failed", error);
    }
  };

  // ===============================
  // UPDATE STATUS
  // ===============================
  const handleUpdateStatus = async () => {
    if (!newStatus) return;

    setUpdatingStatus(true);
    try {
      await api.put(`/tasks/${selectedTask._id}`, {
        status: newStatus,
      });

      setTasks((prev) =>
        prev.map((t) =>
          t._id === selectedTask._id ? { ...t, status: newStatus } : t
        )
      );

      setSelectedTask((prev) => ({ ...prev, status: newStatus }));
      setOpenStatusModal(false);
    } catch (error) {
      alert("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // ===============================
  // EDIT TASK
  // ===============================
  const handleEditTask = async () => {
    try {
      await api.put(`/tasks/${selectedTask._id}`, {
        title: editTitle,
        description: editDescription,
        assignedTo: editAssignedTo,
      });

      fetchTasks();

      setSelectedTask((prev) => ({
        ...prev,
        title: editTitle,
        description: editDescription,
        assignedTo: users.find((u) => u._id === editAssignedTo),
      }));

      setOpenEditModal(false);
    } catch (error) {
      alert("Failed to update task");
    }
  };

  // ===============================
  // DELETE TASK
  // ===============================
  const handleDeleteTask = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/tasks/${selectedTask._id}`);
      setSelectedTask(null);
      fetchTasks();
    } catch (error) {
      alert("Failed to delete task");
    }
  };

  if (loading) return <p>Loading...</p>;

  // ===============================
  // JSX
  // ===============================
  return (
    <div className="relative flex">
      {/* ================= LEFT TABLE ================= */}
      <div className="flex-1 pr-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">All Tasks</h2>
          <button
            onClick={() => setOpenModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Task
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          {["all", "pending", "completed"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-3 py-1 border rounded ${
                filter === item ? "bg-blue-100 text-blue-600" : ""
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <table className="w-full border bg-white text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">ID</th>
              <th>Title</th>
              <th>Assigned</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task._id} className="border-b text-sm">
                <td className="p-2">#{task._id.slice(-5)}</td>
                <td>{task.title}</td>
                <td>{task.assignedTo?.fullName}</td>
                <td>{task.status}</td>
                <td>
                  <button
                    onClick={() => setSelectedTask(task)}
                    className="px-3 py-1 bg-gray-100 rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= RIGHT DETAILS PANEL ================= */}
      {selectedTask && (
        <div className="w-[350px] border-l bg-white p-4">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold">Task Details</h3>
            <button onClick={() => setSelectedTask(null)}>✕</button>
          </div>

          <div className="mb-3 p-2 bg-yellow-50 rounded flex justify-between items-center">
            <span className="font-medium text-yellow-600">
              {selectedTask.status}
            </span>
            <button
              onClick={() => {
                setNewStatus(selectedTask.status);
                setOpenStatusModal(true);
              }}
              className="border px-3 py-1 rounded"
            >
              Update status
            </button>
          </div>

          <p className="text-sm text-gray-500">Title</p>
          <p className="mb-2">{selectedTask.title}</p>

          <p className="text-sm text-gray-500">Assigned To</p>
          <p className="mb-2">{selectedTask.assignedTo?.fullName}</p>

          <p className="text-sm text-gray-500">Description</p>
          <p>{selectedTask.description || "No description provided."}</p>

          {/* ACTION BUTTONS */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => {
                setEditTitle(selectedTask.title);
                setEditDescription(selectedTask.description);
                setEditAssignedTo(selectedTask.assignedTo?._id);
                setOpenEditModal(true);
              }}
              className="flex-1 border px-3 py-2 rounded"
            >
              Edit
            </button>

            <button
              onClick={handleDeleteTask}
              className="flex-1 bg-red-600 text-white px-3 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* ================= UPDATE STATUS MODAL ================= */}
      {openStatusModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] p-5 rounded">
            <h3 className="font-semibold text-lg mb-4">Task Status</h3>

            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setOpenStatusModal(false)}
                className="w-1/2 border p-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateStatus}
                disabled={updatingStatus}
                className="w-1/2 bg-blue-600 text-white p-2 rounded"
              >
                {updatingStatus ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT TASK MODAL ================= */}
      {openEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-5 w-[420px] rounded">
            <h3 className="mb-3 font-semibold text-lg">Edit Task</h3>

            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full border p-2 mb-2"
            />

            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full border p-2 mb-2"
            />

            <select
              value={editAssignedTo}
              onChange={(e) => setEditAssignedTo(e.target.value)}
              className="w-full border p-2 mb-4"
            >
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.fullName}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setOpenEditModal(false)}
                className="w-1/2 border p-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleEditTask}
                className="w-1/2 bg-blue-600 text-white p-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CREATE TASK MODAL ================= */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-5 w-[400px] rounded">
            <h3 className="mb-3 font-semibold">Create Task</h3>

            <input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 mb-2"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 mb-2"
            />

            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full border p-2 mb-4"
            >
              <option value="">Assign to</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.fullName}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setOpenModal(false)}
                className="w-1/2 border p-2"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateTask}
                className="w-1/2 bg-blue-600 text-white p-2"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllTasks;
