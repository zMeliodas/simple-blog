const Blog = () => {
  return (
    <div className="bg-white rounded-lg shadow-md w-6xl p-6 hover:shadow-lg transition">
      <h3 className="text-2xl font-bold text-gray-800 mb-2 cursor-pointer hover:text-indigo-600">
        Getting Started with React
      </h3>
      <div className="text-sm text-gray-500 mb-3">
        By John Paul • 2024-01-10
      </div>
      <p className="text-gray-600 mb-4">
        Learn the fundamentals of React development...
      </p>
      <button className="text-indigo-600 hover:text-indigo-800 font-medium">
        Read More →
      </button>
    </div>
  );
};

export default Blog;
