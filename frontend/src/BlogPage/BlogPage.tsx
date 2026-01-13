import Blog from "./Blog";

const BlogPage = () => {
  return (
    <div className="bg-backgroundColor flex flex-col items-center gap-4 h-screen pt-24">
      <button className="text-indigo-600 font-bold text-3xl pt-4">
        Latest Blog Posts
      </button>

      <div className="bg-backgroundColor flex flex-col gap-2 p-2 pb-8">
        <Blog />
        <Blog />
      </div>
    </div>
  );
};

export default BlogPage;
