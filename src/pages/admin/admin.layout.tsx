import DashboardAdmin from "./dashboard";
import Sidebar from "./sidebar";

const AdminLayout = () => {
  return (
    <>
      <Sidebar />
      <DashboardAdmin />
    </>
  );
};

export default AdminLayout;
