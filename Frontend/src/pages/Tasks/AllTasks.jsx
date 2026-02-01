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
  // STATES (VERY IMPORTANT)
  // ===============================

  // NOTICE: all tasks from database
  const [tasks, setTasks] = useState([]);

  // NOTICE: all users for Assign dropdown
  const [users, setUsers] = useState([]);

  // NOTICE: loading state
  const [loading, setLoading] = useState(true);

  // NOTICE: filter tabs
  const [filter, setFilter] = useState("all");

  // NOTICE: create task modal open/close
  const [openModal, setOpenModal] = useState(false);

  // NOTICE: form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // NOTICE: selected task for RIGHT SIDE PANEL
  const [selectedTask, setSelectedTask] = useState(null);

  // ===============================
  // FETCH TASKS
  // ===============================
  useEffect(() => {
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

    fetchTasks();
  }, []);

  // ===============================
  // FETCH USERS (FOR ASSIGN DROPDOWN)
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
        assignedTo, // NOTICE: USER ID SENT TO BACKEND
      });

      setOpenModal(false);
      window.location.reload(); // simple refresh
    } catch (error) {
      console.error("Create task failed", error);
    }
  };

  // ===============================
  // LOADING UI
  // ===============================
  if (loading) return <p>Loading...</p>;

  // ===============================
  // JSX START
  // ===============================
  return (
    <div className="relative flex">

      {/* ===============================
          LEFT SIDE (TASK TABLE)
         =============================== */}
      <div className="flex-1 pr-4">

        {/* HEADER */}
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">All Tasks</h2>

          <button
            onClick={() => setOpenModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Task
          </button>
        </div>

        {/* FILTERS */}
        <div className="flex gap-2 mb-4">
          {["all", "pending", "completed", "inprogress"].map((item) => (
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

        {/* TABLE */}
        <table className="w-full border bg-white">
          <thead>
            <tr className="border-b text-left">
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
                  {/* NOTICE: THIS IS THE VIEW BUTTON */}
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

      {/* ===============================
          RIGHT SIDE (TASK DETAILS)
         =============================== */}
      {selectedTask && (
        <div className="w-[350px] border-l bg-white p-4 relative">

          {/* HEADER */}
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold">Task Details</h3>
            <button onClick={() => setSelectedTask(null)}>✕</button>
          </div>

          <p className="text-sm text-gray-500">Status</p>
          <p className="mb-3">{selectedTask.status}</p>

          <p className="text-sm text-gray-500">Title</p>
          <p className="mb-3">{selectedTask.title}</p>

          <p className="text-sm text-gray-500">Assigned To</p>
          <p className="mb-3">{selectedTask.assignedTo?.fullName}</p>

          <p className="text-sm text-gray-500">Description</p>
          <p>
            {selectedTask.description || "No description provided"}
          </p>
        </div>
      )}

      {/* ===============================
          CREATE TASK MODAL
         =============================== */}
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

            {/* ASSIGN DROPDOWN */}
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
