import Navbar from "./common/Navbar.tsx";
import BlogPage from "./BlogPage/BlogPage";
import RegistrationPage from "./AuthPages/RegistrationPage";
import LoginPage from "./AuthPages/LoginPage";
import CreateBlog from "./BlogPage/CreateBlog";
import EditBlog from "./BlogPage/EditBlog";
import ViewBlog from "./BlogPage/ViewBlog";
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAppSelector } from "./redux/store.ts";
import { useAppDispatch } from "./redux/store.ts";
import { initAuth } from "./utils/initAuth.ts";
import ProtectedRoute from "./utils/ProtectedRoute.tsx";

const App = () => {
  const dispatch = useAppDispatch();

  const { initialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const { subscription } = initAuth(dispatch).data;

    return () => subscription.unsubscribe();
  }, [dispatch]);

  if (!initialized) {
    return null;
  }

  return (
    <Router>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <BlogPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <BlogPage />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/createBlog"
          element={
            <ProtectedRoute>
              <CreateBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editBlog"
          element={
            <ProtectedRoute>
              <EditBlog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/viewBlog"
          element={
            <ProtectedRoute>
              <ViewBlog />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
