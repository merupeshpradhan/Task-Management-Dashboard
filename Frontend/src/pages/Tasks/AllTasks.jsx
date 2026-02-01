import { useEffect, useState } from "react";
import api from "../Api/api";

function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/tasks"); // admin sees all
        setTasks(res.data.data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, []);

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">All Tasks</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th>Task ID</th>
            <th>Task Title</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Created On</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className="border-t">
              <td>#{task._id.slice(-5)}</td>
              <td>{task.title}</td>
              <td>{task.assignedTo.fullName}</td>
              <td>
                <span
                  className={`px-2 py-1 rounded ${
                    task.status === "pending"
                      ? "bg-yellow-200"
                      : task.status === "completed"
                        ? "bg-green-200"
                        : "bg-blue-200"
                  }`}
                >
                  {task.status}
                </span>
              </td>
              <td>{new Date(task.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllTasks;
