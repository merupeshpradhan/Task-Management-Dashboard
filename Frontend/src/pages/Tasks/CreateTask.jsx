import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/api";

function CreateTask() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // -------------------------
  // FETCH USERS (ADMIN)
  // -------------------------
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users"); // admin users list
        setUsers(res.data.data);
      } catch (error) {
        console.error("Failed to load users", error);
      }
    };

    fetchUsers();
  }, []);

  // -------------------------
  // CREATE TASK
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !assignedTo) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/tasks", {
        title,
        description,
        assignedTo,
      });

      navigate("/alltasks");
    } catch (error) {
      console.error("Create task error", error);
      alert(error.response?.data?.message || "Task creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-6">Create Task</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* TITLE */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Task Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            rows="4"
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* ASSIGN TO */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Assign To
          </label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.fullName} ({user.email})
              </option>
            ))}
          </select>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/alltasks")}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTask;
