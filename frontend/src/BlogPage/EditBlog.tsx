import { useState } from "react";
import { useAppSelector } from "../redux/store.ts";
import { useEffect } from "react";
import { supabase } from "../services/supabaseClient.ts";
import { useNavigate, Link } from "react-router-dom";

interface BlogTypes {
  title: string;
  content: string;
}

const EditBlog = () => {
  const navigate = useNavigate();
  const { selectedBlogId } = useAppSelector((state) => state.blog);

  const [updatedBlog, setUpdatedBlog] = useState<BlogTypes>({
    title: "",
    content: "",
  });

  const [blog, setBlog] = useState<BlogTypes>({
    title: "",
    content: "",
  });

  const handleEditBlog = async () => {
    if (
      updatedBlog.title === blog.title &&
      updatedBlog.content === blog.content
    ) {
      alert("No changes detected.");
      return;
    }

    try {
      const { error } = await supabase
        .from("Blogs")
        .update({
          title: updatedBlog.title,
          content: updatedBlog.content,
        })
        .eq("id", selectedBlogId)
        .select();

      if (error) throw error;

      alert("Blog updated successfully");
      navigate("/viewBlog");
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const fetchSelectedBlog = async () => {
      try {
        const { data, error } = await supabase
          .from("Blogs")
          .select("id, title, author, created_at, content")
          .eq("id", selectedBlogId)
          .single();

        if (data) {
          setBlog(data);
          setUpdatedBlog(data);
        }

        if (error) throw error;
      } catch (error) {
        alert(error);
      }
    };

    fetchSelectedBlog();
  }, [selectedBlogId]);

  return (
    <div className="bg-backgroundColor flex flex-col items-center gap-4 h-screen pt-24">
      <div className="w-3xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Edit Blog Post
        </h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Blog Title
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={updatedBlog.title}
              onChange={(e) => {
                setUpdatedBlog((prev) => ({
                  ...prev,
                  title: e.target.value,
                }));
              }}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Blog Content
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-64"
              value={updatedBlog.content}
              onChange={(e) => {
                setUpdatedBlog((prev) => ({
                  ...prev,
                  content: e.target.value,
                }));
              }}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleEditBlog}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              Update Blog
            </button>
            <Link
              to="/viewBlog"
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;
