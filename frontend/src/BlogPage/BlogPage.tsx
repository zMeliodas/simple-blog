import Blog from "./Blog";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { formatDate, excerpt } from "../utils/utils";
import CustomSpinner from "../common/CustomSpinner";
import Pagination from "../common/Pagination";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";

interface Blog {
  id: string;
  created_at: string;
  title: string;
  content: string;
  author: string;
}

const BlogPage = () => {
  const PAGE_SIZE = 3;
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setIsLoading] = useState<Boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const fetchBlogs = async (page: number) => {
    try {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("User not authenticated");
        return;
      }

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error, count } = await supabase
        .from("Blogs")
        .select("id, created_at, title, content, author", { count: "exact" })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      if (data) {
        setBlogs(data);
        setTotalPages(Math.ceil((count ?? 0) / PAGE_SIZE));
      }
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage]);

  if (loading) {
    return (
      <div className="flex bg-backgroundColor justify-center items-center h-screen">
        <CustomSpinner size="w-28 h-28" color="border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="bg-backgroundColor flex flex-col items-center gap-2 pt-24 p-4 h-screen overflow-auto">
      <button className="text-indigo-600 font-bold text-3xl pt-4 pb-2">
        Latest Blog Posts
      </button>

      {blogs.length < 1 ? (
        <div className="flex items-center justify-center">
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

      {blogs.length > 0 && totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          previous={<FaArrowLeft />}
          next={<FaArrowRight />}
        />
      )}
    </div>
  );
};

export default BlogPage;
