import { Link, Navigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { supabase } from "../services/supabaseClient";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { setSession } from "../redux/authSlice";

interface LoginUserCredentials {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { session, initialized } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [userCredentials, setUserCredentials] = useState<LoginUserCredentials>({
    email: "",
    password: "",
  });

  if (!initialized) return null;
  
  if (session) return <Navigate to="/home" replace />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userCredentials.email.trim()) {
      alert("Email cannot be empty");
      return;
    }

    if (!userCredentials.password.trim()) {
      alert("Password cannot be empty");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userCredentials.email,
        password: userCredentials.password,
      });

      if (error) throw error;
      alert("Login success! Welcome!");
      dispatch(setSession(data.session));
    } catch (error) {
      alert(String(error));
    }
  };

  return (
    <div className="bg-backgroundColor flex flex-col items-center gap-4 w-screen h-screen pt-24">
      <div className="w-full max-w-lg mx-auto px-4 py-18">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Login
          </h2>
          <form onSubmit={handleSubmit}>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4.5"
              placeholder="your@email.com"
              value={userCredentials.email}
              onChange={handleChange}
            />

            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6"
              placeholder="••••••••"
              value={userCredentials.password}
              onChange={handleChange}
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Login
            </button>
          </form>
          <p className="text-center text-gray-600 mt-2">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
