import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/store";
import { supabase } from "../services/supabaseClient";

interface RegisterUserCredentials {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegistrationPage = () => {
  const { session, initialized } = useAppSelector((state) => state.auth);

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const [userCredentials, setUserCredentials] =
    useState<RegisterUserCredentials>({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  if (!initialized) return null;

  if (session) return <Navigate to="/home" replace />;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userCredentials.fullName.trim()) {
      alert("Full name cannot be empty");
      return;
    }

    if (userCredentials.fullName.trim().length < 3) {
      alert("Full name should be at least 3 characters");
      return;
    }

    if (!userCredentials.email.trim()) {
      alert("Email name cannot be empty");
      return;
    }

    if (!regex.test(userCredentials.email)) {
      alert("Invalid Email. Please try again.");
      return;
    }

    if (userCredentials.password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    if (userCredentials.confirmPassword !== userCredentials.password) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: userCredentials.email,
        password: userCredentials.password,
        options: {
          data: {
            full_name: userCredentials.fullName,
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      alert(String(error));
    } finally {
      alert("Registration successful! You can now log in your account.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="bg-backgroundColor flex flex-col items-center gap-4 w-screen h-screen pt-24">
      <div className="w-full max-w-lg mx-auto px-4 py-18">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Create Account
          </h2>
          <form onSubmit={handleSubmit}>
            <label className="block text-gray-700 font-medium mb-0.5">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
              placeholder="John Doe"
              value={userCredentials.fullName}
              onChange={handleChange}
            />

            <label className="block text-gray-700 font-medium mb-0.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
              placeholder="your@email.com"
              value={userCredentials.email}
              onChange={handleChange}
            />

            <label className="block text-gray-700 font-medium mb-0.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
              placeholder="••••••••"
              value={userCredentials.password}
              onChange={handleChange}
            />

            <label className="block text-gray-700 font-medium mb-0.5">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6.5"
              placeholder="••••••••"
              value={userCredentials.confirmPassword}
              onChange={handleChange}
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Create Account
            </button>
          </form>
          <p className="text-center text-gray-600 mt-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
