import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { formatDate } from "../utils/utils";
import { useAppSelector } from "../redux/store.ts";
import CustomSpinner from "../common/CustomSpinner.tsx";

interface ViewBlogProps {
  title: string;
  author: string;
  created_at: string;
  content: string;
  id: string;
}

const ViewBlog = () => {
  const navigate = useNavigate();
  const [blog, setBlog] = useState<ViewBlogProps | null>(null);
  const { selectedBlogId } = useAppSelector((state) => state.blog);
  const [loading, setIsLoading] = useState<Boolean>(false);

  const handleDeleteBlog = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("Blogs")
        .delete()
        .eq("id", selectedBlogId);

      if (error) throw error;
      alert("Blog deleted successfully!");
      navigate("/home");
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (!selectedBlogId) {
      navigate("/home");
      return;
    }

    const fetchSelectedBlog = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("Blogs")
          .select("id, title, author, created_at, content")
          .eq("id", selectedBlogId)
          .single();

        if (data) setBlog(data);

        if (error) throw error;
      } catch (error) {
        alert(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSelectedBlog();
  }, [selectedBlogId]);

  if (loading) {
    return (
      <div className="flex bg-backgroundColor justify-center items-center h-screen">
        <CustomSpinner size="w-28 h-28" color="border-indigo-500" />
      </div>
    );
  }

  if (!blog) return;

  return (
    <div className="bg-backgroundColor flex flex-col items-center gap-4 h-screen overflow-auto pt-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          to="/home"
          className="text-indigo-600 hover:text-indigo-800 mb-6 flex items-center gap-2"
        >
          ← Back to Home
        </Link>
        <article className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-1">
            {blog.title}
          </h1>
          <div className="text-sm text-gray-500 mb-4">
            By {blog.author} • {formatDate(blog.created_at)}
          </div>
          <div className="text-base text-gray-700 whitespace-pre-wrap">
            {blog.content}
          </div>

          <div className="mt-1 pt-4 flex gap-1">
            <Link
              to="/editBlog"
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Edit
            </Link>
            <button
              onClick={handleDeleteBlog}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ViewBlog;
