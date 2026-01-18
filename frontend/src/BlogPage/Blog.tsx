import { useNavigate } from "react-router-dom";
import { setSelectedBlogId } from "../redux/blogSlice";
import { useDispatch } from "react-redux";

interface BlogProps {
  blogTitle: string;
  author: string;
  date: string;
  excerpt: string;
  blogId: string;
}

const Blog = ({ blogTitle, author, date, excerpt, blogId }: BlogProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBlogSelect = (selectedBlogId: string) => {
    dispatch(setSelectedBlogId(selectedBlogId));
    navigate("/viewBlog");
  };

  return (
    <div className="bg-white rounded-lg shadow-md w-full lg:w-5xl p-6 hover:shadow-lg transition">
      <p
        onClick={() => handleBlogSelect(blogId)}
        className="text-2xl font-bold text-gray-800 mb-1 cursor-pointer hover:text-indigo-600"
      >
        {blogTitle}
      </p>
      <div className="text-sm text-gray-500 mb-3">
        By {author} • {date}
      </div>
      <p className="text-gray-600 mb-4">{excerpt}</p>
      <button
        onClick={() => handleBlogSelect(blogId)}
        className="text-indigo-600 hover:text-indigo-800 font-medium hover:scale-105"
      >
        Read More →
      </button>
    </div>
  );
};

export default Blog;
