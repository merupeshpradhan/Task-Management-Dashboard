import { useNavigate } from "react-router-dom";
import { checkUserRole } from "../Api/auth";

const SelectRole = () => {
  const navigate = useNavigate();

  const handleClick = async (clickedRole) => {
    try {
      const res = await checkUserRole();
      const dbRole = res.data.data.role;

      if (dbRole !== clickedRole) {
        alert("Access denied: role mismatch");
        return;
      }

      if (dbRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      alert("Please login again");
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex items-center justify-center bg-indigo-100">
        <h1 className="text-3xl font-bold">Task System</h1>
      </div>

      <div className="w-1/2 flex items-center justify-center">
        <div>
          <h2 className="text-2xl font-bold mb-6">Choose Role</h2>

          <div className="flex gap-6">
            <button
              onClick={() => handleClick("admin")}
              className="px-6 py-3 bg-indigo-600 text-white rounded"
            >
              Continue as Admin
            </button>

            <button
              onClick={() => handleClick("user")}
              className="px-6 py-3 bg-gray-700 text-white rounded"
            >
              Continue as User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectRole;
