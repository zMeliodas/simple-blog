import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { formatDate } from "../utils/stringUtils.ts";
import { useAppSelector } from "../redux/store.ts";
import CustomSpinner from "../common/CustomSpinner.tsx";
import { type BlogTypes } from "../types/types.ts";
import { deleteImage } from "../utils/ImageHandling.ts";
import CommentSection from "./CommentSection.tsx";

const ViewBlog = () => {
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogTypes | null>(null);
  const { selectedBlogId } = useAppSelector((state) => state.blog);
  const { session } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleting, setIsDeleting] = useState<boolean>(false);

  const handleDeleteBlog = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog? This action cannot be undone.",
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("Blogs")
        .delete()
        .eq("id", selectedBlogId);

      if (blog?.image_url) {
        await deleteImage(blog.image_url);
      }

      if (error) throw error;
      alert("Blog deleted successfully!");
      navigate("/home");
    } catch (error) {
      alert(error);
    } finally {
      setIsDeleting(false);
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
          .select("id, title, author, created_at, user_id, content, image_url")
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

  if (isLoading) {
    return (
      <div className="flex bg-backgroundColor justify-center items-center h-screen">
        <CustomSpinner size="w-28 h-28" color="border-indigo-500" />
      </div>
    );
  }

  if (!session) return;
  if (!blog) return;

  return (
    <>
      <div className="bg-backgroundColor flex flex-col items-center gap-4 h-screen pt-24">
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
          <Link
            to="/home"
            className="text-indigo-600 hover:text-indigo-800 mb-6 flex items-center gap-2"
          >
            ← Back to Home
          </Link>
          <article className="bg-white rounded-lg shadow-md p-8 mb-4">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-1">
              {blog.title}
            </h1>
            <div className="text-sm text-gray-500 mb-4">
              By {blog.author} • {formatDate(blog.created_at)}
            </div>
            {blog.image_url && (
              <div className="w-full mb-4">
                <img
                  src={blog.image_url}
                  alt={blog.title}
                  className="w-full max-h-1000 object-contain rounded-xl z-0"
                />
              </div>
            )}
            <div className="text-base text-gray-700 whitespace-pre-wrap">
              {blog.content}
            </div>

            {blog.user_id === session.user?.id && (
              <div className="mt-1 pt-4 flex gap-1">
                <Link
                  to="/editBlog"
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDeleteBlog}
                  disabled={deleting}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-red-300 transition"
                >
                  <p className="flex gap-1 item-center content-center">
                    {deleting ? (
                      <>
                        <CustomSpinner color="color-white" />{" "}
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <span>Delete</span>
                    )}
                  </p>
                </button>
              </div>
            )}
          </article>
          <CommentSection />
        </div>
      </div>
    </>
  );
};

export default ViewBlog;
