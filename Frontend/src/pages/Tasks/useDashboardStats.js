import { useEffect, useState } from "react";
import api from "../Api/api";

export const useDashboardStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/tasks"); // ADMIN ALL TASKS
        const tasks = res.data.data;

        setStats({
          total: tasks.length,
          pending: tasks.filter(t => t.status === "pending").length,
          inProgress: tasks.filter(t => t.status === "in-progress").length,
          completed: tasks.filter(t => t.status === "completed").length,
        });
      } catch (error) {
        console.error("Dashboard stats error:", error);
      }
    };

    fetchStats();
  }, []);

  return stats;
};
