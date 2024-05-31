import ai from "../assets/ai.jpg";
import { clearSession } from "../shared/Session";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    clearSession();
    navigate("/");
  };
  return (
    <div className="bg-mainColor rounded-bl-xl rounded-br-xl  shadow-md">
      <nav className="container mx-auto z-20 w-full">
        <div className=" max-w-screen-xl items-center justify-between p-4">
          <div className="grid grid-cols-12">
            <div className="col-span-6  md:col-span-6 lg:col-span-6">
              <div className="flex items-center gap-2">
                <div className="relative flex">
                  <img
                    src={ai}
                    className="h-10 w-10 items-center justify-center rounded-full object-cover"
                  />
                </div>
                <div className="flex flex-col text-white">
                  <h1 className="font-semibold">Erastus Junior</h1>
                </div>
              </div>
            </div>
            <div className="col-span-6 flex justify-end items-center  md:col-span-6 lg:col-span-6">
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md text-sm bg-gray-500 hover:bg-gray-600 transition duration-500"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
