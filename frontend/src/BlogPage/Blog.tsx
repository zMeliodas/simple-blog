import { useNavigate } from "react-router-dom";
import { setSelectedBlogId } from "../redux/blogSlice";
import { useDispatch } from "react-redux";
import { type BlogTypes } from "../types/types";

const Blog = ({ title, author, created_at, content, id, user_id }: BlogTypes) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleBlogSelect = (selectedBlogId: string) => {
    dispatch(setSelectedBlogId(selectedBlogId));
    navigate("/viewBlog");
  };

  return (
    <div
      onClick={() => handleBlogSelect(id)}
      className="bg-white rounded-lg shadow-md w-full lg:w-5xl p-6 hover:shadow-lg transition"
    >
      <p
        onClick={() => handleBlogSelect(id)}
        className="text-2xl font-bold text-gray-800 mb-1 cursor-pointer hover:text-indigo-600"
      >
        {title}
      </p>
      <div className="text-sm text-gray-500 mb-3">
        By {author} • {created_at}
      </div>
      <p className="text-gray-600 mb-4">{content}</p>

      <button
        onClick={() => handleBlogSelect(id)}
        className="text-indigo-600 hover:text-indigo-800 font-medium hover:scale-105"
      >
        Read More →
      </button>
    </div>
  );
};

export default Blog;
