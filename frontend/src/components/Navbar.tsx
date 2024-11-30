import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-md">
      <div className="text-2xl font-semibold">
        <span className="text-indigo-400 cursor-pointer" onClick={() => navigate("/dashboard")}>Logo</span>
      </div>

      <div className="flex gap-4">
        {!token ? (
          <>
            <button
              onClick={() => navigate("/signup")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            >
              Signup
            </button>
            <button
              onClick={() => navigate("/signin")}
              className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            >
              Signin
            </button>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
