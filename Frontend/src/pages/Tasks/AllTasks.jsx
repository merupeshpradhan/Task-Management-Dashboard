import { useEffect, useState } from "react";
import api from "../Api/api";

/* ===============================
   DATE FORMATTER
================================ */
const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* ===============================
   STATUS MODAL
================================ */
function TaskStatusModal({ task, onClose, onSave }) {
  const [status, setStatus] = useState(task.status);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold">Task Status</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="bg-orange-50 text-orange-600 px-3 py-2 rounded mb-4">
          Status <span className="float-right capitalize">{status}</span>
        </div>

        <p className="text-sm text-gray-400">Update status</p>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-2"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="w-1/2 py-2 bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(task._id, status)}
            className="w-1/2 py-2 bg-indigo-600 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===============================
   EDIT TASK MODAL
================================ */
function EditTaskModal({ task, users, onClose, onSave }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [assignedTo, setAssignedTo] = useState(task.assignedTo?._id);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold">Edit Task</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="space-y-3 text-sm">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Task title"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={3}
            placeholder="Description"
          />

          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.fullName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="w-1/2 py-2 bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onSave(task._id, { title, description, assignedTo })
            }
            className="w-1/2 py-2 bg-indigo-600 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===============================
   DELETE MODAL
================================ */
function DeleteConfirmModal({ onClose, onDelete }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[380px] rounded-2xl p-6 shadow-xl text-center">
        <h3 className="font-semibold mb-2">Delete this task?</h3>
        <p className="text-sm text-gray-500 mb-6">
          This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="w-1/2 py-2 bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="w-1/2 py-2 bg-red-600 text-white rounded"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===============================
   MAIN COMPONENT
================================ */
export default function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [statusOpen, setStatusOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    api.get("/tasks").then(res => setTasks(res.data.data));
    api.get("/users").then(res => setUsers(res.data.data));
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/tasks/${id}`, { status });
    setTasks(t => t.map(x => x._id === id ? { ...x, status } : x));
    setStatusOpen(false);
  };

  const editTask = async (id, data) => {
    await api.put(`/tasks/${id}`, data);
    setTasks(t => t.map(x => x._id === id ? { ...x, ...data } : x));
    setEditOpen(false);
  };

  const deleteTask = async () => {
    await api.delete(`/tasks/${selectedTask._id}`);
    setTasks(t => t.filter(x => x._id !== selectedTask._id));
    setSelectedTask(null);
    setDeleteOpen(false);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen p-6 gap-6">

      {/* TASK LIST */}
      <div className="flex-1 bg-white rounded-xl shadow">
        <table className="w-full">
          <thead className="text-sm text-gray-500 border-b">
            <tr>
              <th className="p-3">ID</th>
              <th>Title</th>
              <th>Assigned</th>
              <th>Status</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(t => (
              <tr key={t._id} className="border-b hover:bg-gray-50 text-sm">
                <td className="p-3">#{t._id.slice(-5)}</td>
                <td>{t.title}</td>
                <td>{t.assignedTo?.fullName}</td>
                <td className="capitalize">{t.status}</td>
                <td>{formatDate(t.createdAt)}</td>
                <td>
                  <button
                    onClick={() => setSelectedTask(t)}
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

      {/* RIGHT PANEL */}
      {selectedTask && (
        <div className="w-[360px] bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold mb-3">Task Details</h3>

          <p className="text-sm text-gray-400">Status</p>
          <p className="mb-3 capitalize">{selectedTask.status}</p>

          <p className="text-sm text-gray-400">Title</p>
          <p className="mb-3">{selectedTask.title}</p>

          <p className="text-sm text-gray-400">Assigned</p>
          <p className="mb-3">{selectedTask.assignedTo?.fullName}</p>

          <p className="text-sm text-gray-400">Created</p>
          <p className="mb-4">{formatDate(selectedTask.createdAt)}</p>

          <div className="flex gap-2">
            <button
              onClick={() => setDeleteOpen(true)}
              className="flex-1 bg-gray-100 py-2 rounded"
            >
              Delete
            </button>
            <button
              onClick={() => setEditOpen(true)}
              className="flex-1 bg-indigo-600 text-white py-2 rounded"
            >
              Edit Task
            </button>
          </div>

          <button
            onClick={() => setStatusOpen(true)}
            className="mt-3 w-full bg-indigo-100 text-indigo-600 py-2 rounded"
          >
            Update Status
          </button>
        </div>
      )}

      {statusOpen && (
        <TaskStatusModal
          task={selectedTask}
          onClose={() => setStatusOpen(false)}
          onSave={updateStatus}
        />
      )}

      {editOpen && (
        <EditTaskModal
          task={selectedTask}
          users={users}
          onClose={() => setEditOpen(false)}
          onSave={editTask}
        />
      )}

      {deleteOpen && (
        <DeleteConfirmModal
          onClose={() => setDeleteOpen(false)}
          onDelete={deleteTask}
        />
      )}
    </div>
  );
}
