import { Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useAppSelector } from "../redux/store";

const Navbar = () => {
  const { session } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");

    if (!confirmed) return;

    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;
    } catch (error) {
      alert(error);
    }
  };

  return (
    <nav className="bg-backgroundColor flex px-4 items-center py-1 w-full fixed h-22 shadow-md">
      <Link to="/" className="text-indigo-600 flex-1 font-bold text-2xl">
        Simple Blog App
      </Link>

      {session && (
        <div className="flex gap-1">
          <Link
            to="/createBlog"
            className="bg-green-300 text-sm font-medium p-4 rounded-4xl hover:scale-105"
          >
            + New Blog
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-400 text-sm font-medium p-4 rounded-4xl hover:scale-105"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
