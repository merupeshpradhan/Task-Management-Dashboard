import { Route, Routes } from "react-router-dom";
import Starting from "./pages/Starting";
import SignIn from "./pages/Auth/SignIn/SignIn";
import SignUp from "./pages/Auth/SignUp/SignUp";
import TaskManagement from "./pages/Tasks/TaskManagement";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Starting />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/taskmanagement" element={<TaskManagement />} />
    </Routes>
  );
}

export default App;
