import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const menus = [
    {
      to: "/adminavatara",
      name: "Dashboard",
      icon: (
        <svg
          className="w-5 h-5 "
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 21"
        >
          <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
          <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
        </svg>
      ),
    },
    {
      to: "/adminchat",
      name: "Admin Chat",
      icon: (
        <svg
          className="w-5 h-5 "
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12,2A10,10,0,0,0,5.12,4.77V3a1,1,0,0,0-2,0V7.5a1,1,0,0,0,1,1H8.62a1,1,0,0,0,0-2H6.22A8,8,0,1,1,4,12a1,1,0,0,0-2,0A10,10,0,1,0,12,2Zm0,6a1,1,0,0,0-1,1v3a1,1,0,0,0,1,1h2a1,1,0,0,0,0-2H13V9A1,1,0,0,0,12,8Z" />
        </svg>
      ),
    },
  ];
  const location = useLocation();

  return (
    <div className={`fixed top-0 left-0 z-0 h-screen`}>
      <div className={`h-full px-3 w-20 py-4 overflow-y-auto bg-[#5751c8]`}>
        <h1 className="py-4 font-semibold text-sm text-white">Admin Panel</h1>
        <ul className="space-y-2 font-medium">
          {menus.map((item, index) => (
            <li key={index}>
              <Link to={item?.to}>
                <div
                  className={`flex items-center p-2 text-white justify-center rounded-lg transition duration-500 ${
                    location.pathname === item.to
                      ? "bg-indigo-800 text-white"
                      : "dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {item?.icon}
                  {/* <span className="ms-3 text-sm">{item.name}</span> */}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
