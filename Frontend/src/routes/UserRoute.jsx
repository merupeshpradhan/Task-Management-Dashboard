import { Navigate } from "react-router-dom";

const UserRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/signin" />;
  if (user.role !== "user") return <Navigate to="/admin" />;

  return children;
};

export default UserRoute;
