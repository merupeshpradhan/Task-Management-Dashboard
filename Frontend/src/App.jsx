import { Route, Routes } from "react-router-dom";
import Starting from "./pages/Starting";
import SignIn from "./pages/Auth/SignIn/SignIn";
import SignUp from "./pages/Auth/SignUp/SignUp";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Starting />}></Route>
      <Route path="/signin" element={<SignIn />}></Route>
      <Route path="/signup" element={<SignUp />}></Route>
    </Routes>
  );
}

export default App;
