import { Routes, Route } from "react-router-dom";
import Starting from "./pages/Starting";
import SignIn from "./pages/Auth/SignIn/SignIn";
import SignUp from "./pages/Auth/SignUp/SignUp";
import DashboardLayout from "./pages/layouts/DashboardLayout";
import TaskManagement from "./pages/Tasks/TaskManagement";
import AllTasks from "./pages/Tasks/AllTasks";
import CreateTask from "./pages/Tasks/CreateTask";
// import Tasks from "./pages/Tasks/Tasks";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Starting />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* DASHBOARD LAYOUT */}
      <Route path="/" element={<DashboardLayout />}>
        <Route path="taskmanagement" element={<TaskManagement />} />
        <Route path="alltasks" element={<AllTasks />} />
        <Route path="createtask" element={<CreateTask />} />
        {/* <Route path="/tasks" element={<Tasks />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
