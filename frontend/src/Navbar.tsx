import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-backgroundColor flex px-4 justify-between items-center w-full py-1 fixed h-22 shadow-md">
      <Link to="/" className="text-indigo-600 flex font-bold text-2xl">
        Simple Blog App
      </Link>

      <button className="bg-green-300 text-sm font-medium p-4 rounded-4xl hover:scale-105">
        + New Blog
      </button>
    </nav>
  );
};

export default Navbar;
