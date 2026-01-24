import { useState, type ChangeEvent, useEffect, useRef } from "react";
import { IoCameraOutline } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { supabase } from "../services/supabaseClient";
import { uploadImage, deleteImage } from "../utils/ImageHandling";
import { useAppSelector } from "../redux/store";
import { type CommentTypes } from "../types/types";
import { formatDate } from "../utils/stringUtils";
import { MdDelete } from "react-icons/md";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";

const CommentSection = () => {
  const [commentBoxValue, setCommentBoxValue] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { session } = useAppSelector((state) => state.auth);
  const { selectedBlogId } = useAppSelector((state) => state.blog);
  const [comments, setComments] = useState<CommentTypes[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      const fileSizeMB = file.size / (1024 * 1024);

      if (!validTypes.includes(file.type)) {
        alert("Please upload a valid image file (PNG, JPG, or JPEG)");
        return;
      }

      if (fileSizeMB > 50) {
        alert("Image size must be less than 50MB");
        return;
      }

      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPicker]);

  const onEmojiClick = (emojiObject: any) => {
    setCommentBoxValue((prev) => prev + emojiObject.emoji);
  };

  const removeImage = (): void => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmitComment = async () => {
    if (!commentBoxValue.trim() && !image) {
      alert("You cannot submit empty comment");
      return;
    }

    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("User not authenticated");
        return;
      }

      let imageUrl = null;

      if (image) {
        imageUrl = await uploadImage(image, "comments");
        if (!imageUrl) {
          alert("Failed to upload image");
          return;
        }
      }

      const { error } = await supabase.from("Comments").insert({
        user_id: user.id,
        blog_id: selectedBlogId,
        content: commentBoxValue,
        author: user.user_metadata.full_name,
        image_url: imageUrl,
      });

      if (error) throw error;
      fetchComments();
      setCommentBoxValue("");
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      alert(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (
    commentId: string,
    imageUrl: string | null,
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      const { error } = await supabase
        .from("Comments")
        .delete()
        .eq("id", commentId);

      if (imageUrl) {
        await deleteImage(imageUrl);
      }

      if (error) throw error;
      alert("Comment deleted successfully!");
      fetchComments();
    } catch (error) {
      alert(error);
    }
  };

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("Comments")
        .select("id, blog_id, user_id, author, content, created_at, image_url")
        .eq("blog_id", selectedBlogId)
        .order("created_at", { ascending: false });

      if (data) {
        setComments(data);
      }
      if (error) throw error;
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Comments ({comments.length})
      </h2>

      <div className="mb-8 pb-8 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Leave a Comment
        </h3>

        <div className="flex flex-col mb-1 border border-gray-300 rounded-xl">
          <textarea
            className="w-full px-4 py-2 border-gray-300 rounded-md focus:ring-1 focus:ring-transparent focus:border-transparent min-h-18 outline-none resize-none"
            value={commentBoxValue}
            onChange={(e) => setCommentBoxValue(e.target.value)}
            placeholder="Share your thoughts..."
          />

          <div className="flex flex-row justify-between content-center items-center mt-1 mx-1 mb-1">
            <div className="flex content-center items-center">
              <label
                htmlFor="image-upload"
                className="hover:bg-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed text-indigo-600 pr-7.5 pl-1.5 py-1.5 w-8 rounded-full font-medium transition"
              >
                <IoCameraOutline className="w-6 h-6" />
              </label>
              <input
                type="file"
                id="image-upload"
                accept=".jpg,.jpeg,.png"
                onChange={handleImageChange}
                className="hidden"
              />

              <div className="relative" ref={emojiPickerRef}>
                <button
                  onClick={() => setShowPicker(!showPicker)}
                  className="hover:bg-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed text-indigo-600 pr-1 pl-1.5 py-1.5 w-8 rounded-full font-medium transition"
                >
                  <BsEmojiSmile className="w-5 h-5" />
                </button>

                {showPicker && (
                  <div className="absolute bottom-full left-0 mb-2 z-50">
                    <EmojiPicker
                      onEmojiClick={onEmojiClick}
                      width={350}
                      height={400}
                      previewConfig={{ showPreview: false }}
                      searchDisabled={true}
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              disabled={isLoading || (!commentBoxValue && !imagePreview)}
              onClick={handleSubmitComment}
              className="hover:bg-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed text-indigo-600 pl-2.5 p-2 w-8 rounded-full font-medium transition"
            >
              <IoSend aria-label="Send comment" />
            </button>
          </div>
        </div>

        {imagePreview && (
          <div className="relative w-54 max-w-sm">
            <div className="relative h-full w-full overflow-hidden rounded-xl bg-gray-100">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-fill rounded-lg z-0"
              />

              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-1 text-sm text-gray-700">{image?.name}</div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0"
          >
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-gray-900">{comment.author}</h4>
              <p className="text-sm text-gray-500">
                {formatDate(comment.created_at)}
              </p>
            </div>

            <div className="flex justify-between">
              <div className="flex flex-col">
                <p className="text-gray-700 leading-relaxed mb-1">
                  {comment.content}
                </p>

                {comment.image_url && (
                  <img
                    className="w-54 h-full object-fill rounded-lg z-0"
                    src={comment.image_url}
                    alt=""
                  />
                )}
              </div>
              <div className="flex content-center items-center">
                {session?.user.id === comment.user_id && (
                  <button
                    className="p-2 hover:bg-gray-300 rounded-full"
                    onClick={() => {
                      handleDeleteComment(comment.id, comment.image_url);
                    }}
                  >
                    <MdDelete className="w-5 h-5 text-red-500" />
                  </button>
                )}
              </div>
            </div>
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
