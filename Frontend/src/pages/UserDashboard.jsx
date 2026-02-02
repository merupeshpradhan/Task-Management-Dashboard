import { useEffect, useState } from "react";
import api from "../Api/api";

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyTasks = async () => {
    try {
      const res = await api.get("/tasks/my-tasks");
      setTasks(res.data.data);
    } catch (error) {
      console.error("Failed to load tasks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>

      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks assigned to you</p>
      ) : (
        <table className="w-full border bg-white">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">Title</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="border-b">
                <td className="p-2">{task.title}</td>
                <td>{task.status}</td>
                <td>
                  <button
                    onClick={async () => {
                      const newStatus =
                        task.status === "pending"
                          ? "completed"
                          : "pending";

                      await api.put(`/tasks/${task._id}`, {
                        status: newStatus,
                      });

                      fetchMyTasks();
                    }}
                    className="px-3 py-1 border rounded"
                  >
                    Toggle Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserDashboard;
