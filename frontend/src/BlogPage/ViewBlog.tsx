
const ViewBlog = () => {
  return (
    <div className="bg-backgroundColor flex flex-col items-center gap-4 h-screen pt-24">
      <div className="w-4xl mx-auto px-4 py-8">
        <button
          className="text-indigo-600 hover:text-indigo-800 mb-6 flex items-center gap-2"
        >
          ← Back to Home
        </button>
        <article className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Blog Title</h1>
          <div className="text-sm text-gray-500 mb-6">By John Paul • date</div>
          <div className="prose prose-lg text-gray-700 whitespace-pre-wrap">
            Content
          </div>

          <div className="mt-8 pt-6 border-t flex gap-3">
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
              Edit
            </button>
            <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
              Delete
            </button>
          </div>
        </article>
      </div>
    </div>
  );
};

export default ViewBlog;
