import Blog from "./Blog";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { formatDate, excerpt } from "../utils/utils";
import CustomSpinner from "../common/CustomSpinner";

interface Blog {
  id: string;
  created_at: string;
  title: string;
  content: string;
  author: string;
}

const BlogPage = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setIsLoading] = useState<Boolean>(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          alert("User not authenticated");
          return;
        }

        const { data, error } = await supabase
          .from("Blogs")
          .select("id, created_at, title, content, author")
          .eq("user_id", user.id);

        if (error) throw error;

        if (data) setBlogs(data);
      } catch (error) {
        alert(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex bg-backgroundColor justify-center items-center h-screen">
        <CustomSpinner size="w-28 h-28" color="border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="bg-backgroundColor flex flex-col items-center gap-4 h-screen pt-24">
      <button className="text-indigo-600 font-bold text-3xl pt-4">
        Latest Blog Posts
      </button>

      {blogs.length < 1 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-black font-normal text-2xl pt-4">
            No blog entries have been published yet.
          </p>
        </div>
      ) : (
        blogs.map((blog) => (
          <Blog
            key={blog.id}
            blogTitle={blog.title}
            author={blog.author}
            date={formatDate(blog.created_at)}
            excerpt={excerpt(blog.content)}
            blogId={blog.id}
          />
        ))
      )}
    </div>
  );
};

export default BlogPage;
