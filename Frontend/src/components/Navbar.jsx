import { useEffect, useState } from "react";

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    updateUser();
    window.addEventListener("userUpdated", updateUser);

    return () =>
      window.removeEventListener("userUpdated", updateUser);
  }, []);

  return (
    <nav className="h-14 bg-white border-b flex items-center justify-between px-6">
      <h1 className="font-semibold">Task Dashboard</h1>

      <div className="flex items-center gap-2">
        <img
          src="/user-image.png"
          alt="user"
          className="w-8 h-8 rounded-full"
        />
        <span className="font-medium">
          {user?.fullName || "User"}
        </span>
      </div>
    </nav>
  );
}

export default Navbar;
