import { useState } from "react";
import { type CommentTypes } from "../types/types";

const CommentSection = () => {
  const [comments, setComments] = useState<CommentTypes[]>([
    {
      id: "1",
      author: "Sarah Johnson",
      created_at: "2026-01-20",
      blog_id: "1",
      user_id: "2",
      content:
        "Great article! Breaking down complex ideas into manageable pieces is definitely the key to successful development.",
    },
    {
      id: "2",
      author: "Mike Chen",
      blog_id: "1",
      user_id: "2",
      created_at: "2026-01-21",
      content:
        "This resonates with my experience. I always start with a rough prototype and iterate from there.",
    },
    {
      id: "3",
      author: "Mike Chen",
      blog_id: "1",
      user_id: "2",
      created_at: "2026-01-21",
      content:
        "This resonates with my experience. I always start with a rough prototype and iterate from there.",
    },
    {
      id: "4",
      author: "Mike Chen",
      blog_id: "1",
      user_id: "2",
      created_at: "2026-01-21",
      content:
        "This resonates with my experience. I always start with a rough prototype and iterate from there.",
    },
  ]);

  return (
    <div className="bg-white rounded-lg shadow-md p-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Comments ({comments.length})
      </h2>

      <div className="mb-8 pb-8 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Leave a Comment
        </h3>

        <div className="flex flex-col mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comment
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 min-h-28 outline-none"
            placeholder="Share your thoughts..."
          />
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium transition">
          Post Comment
        </button>
      </div>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">{comment.author}</h4>
              <span className="text-sm text-gray-500">
                {comment.created_at}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed">{comment.content}</p>
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
};

export default CommentSection;
