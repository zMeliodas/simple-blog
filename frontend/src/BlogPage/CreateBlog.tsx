const CreateBlog = () => {
  return (
    <div className="bg-backgroundColor flex flex-col items-center gap-4 h-screen pt-24">
      <div className="bg-backgroundColor w-3xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Create New Blog Post
        </h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Blog Title
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your blog title..."
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Blog Content
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-64"
              placeholder="Write your blog content here..."
            />
          </div>
          <div className="flex gap-3">
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium">
              Publish Blog
            </button>
            <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
