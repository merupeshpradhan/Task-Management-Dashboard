import { useEffect, useState } from "react";
import SearchBar from "../pages/Tasks/SearchBar";

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <nav className="w-full  py-3 px-4 flex justify-between items-center z-50">
      {/* Logo / App Name */}
      <div className="flex items-center gap-2">
        <SearchBar />
      </div>
      {/* User Info */}
      <div className="flex items-center gap-2">
        <img
          src="/user-image.png"
          alt={user?.fullName}
          className="w-8 h-8 rounded-full"
        />
        <span className="font-semibold text-green-900">
          {user?.fullName || "Guest"}
        </span>
      </div>
    </nav>
  );
}

export default Navbar;
