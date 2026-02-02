import { Routes, Route } from "react-router-dom";
import Starting from "./pages/Starting";
import SignIn from "./Auth/SignIn/SignIn";
import SignUp from "./Auth/SignUp/SignUp";
import DashboardLayout from "./layouts/DashboardLayout";
import TaskManagement from "./pages/Tasks/TaskManagement";
import AllTasks from "./components/AllTasks";
import CreateTask from "./pages/Tasks/CreateTask";
import SelectRole from "./pages/SelectRole";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Starting />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      
      <Route path="/select-role" element={<SelectRole />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/dashboard" element={<UserDashboard />} />

      {/* DASHBOARD LAYOUT */}
      <Route path="/" element={<DashboardLayout />}>
        <Route path="taskmanagement" element={<TaskManagement />} />
        <Route path="alltasks" element={<AllTasks />} />
        <Route path="createtask" element={<CreateTask />} />
      </Route>
    </Routes>
  );
}

export default App;
