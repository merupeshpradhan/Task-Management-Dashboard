import AllTasks from "../components/AllTasks";

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Admin can manage everything */}
      <AllTasks />
    </div>
  );
};

export default AdminDashboard;
