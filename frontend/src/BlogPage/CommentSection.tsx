import { useState, type ChangeEvent, useEffect, useRef } from "react";
import { supabase } from "../services/supabaseClient";
import { uploadImage, deleteImage } from "../utils/ImageHandling";
import { useAppSelector } from "../redux/store";
import { type CommentTypes } from "../types/types";
import { formatDate } from "../utils/stringUtils";
import CommentActions from "../common/CommentActions";
import CommentInput from "../common/CommentInput";
import ImagePrev from "../common/ImagePrev";

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
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [newCommentValue, setNewCommentValue] = useState<string>("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [isEditingComment, setIsEditingComment] = useState<boolean>(false);

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    setImageState: React.Dispatch<React.SetStateAction<File | null>>,
    setPreviewState: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
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

      setImageState(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewState(reader.result as string);
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

  const handleEmojiClick = (
    emojiObject: any,
    setValue: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    setValue((prev) => prev + emojiObject.emoji);
  };

  const handleRemoveImage = (
    setImageState: React.Dispatch<React.SetStateAction<File | null>>,
    setPreviewState: React.Dispatch<React.SetStateAction<string | null>>,
  ) => {
    setImageState(null);
    setPreviewState(null);
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

  const handleEditComment = async (
    commentId: string,
    originalContent: string,
    originalImageUrl: string | null,
  ) => {
    if (!newCommentValue.trim() && !newImagePreview) {
      alert("Comment cannot be empty");
      return;
    }

    setIsEditingComment(true);

    try {
      let imageUrl = originalImageUrl;
      let imageChanged = false;

      if (!newImagePreview && originalImageUrl) {
        await deleteImage(originalImageUrl);
        imageUrl = null;
        imageChanged = true;
      } else if (newImage) {
        if (originalImageUrl) {
          await deleteImage(originalImageUrl);
        }

        const uploadedUrl = await uploadImage(newImage, "comments");
        if (!uploadedUrl) {
          alert("Failed to upload image");
          setIsEditingComment(false);
          return;
        }

        imageUrl = uploadedUrl;
        imageChanged = true;
      }

      const updates: any = {};

      if (newCommentValue !== originalContent) {
        updates.content = newCommentValue;
      }

      if (imageChanged) {
        updates.image_url = imageUrl;
      }

      const { error } = await supabase
        .from("Comments")
        .update(updates)
        .eq("id", commentId);

      if (error) throw error;

      fetchComments();

      setEditingCommentId(null);
      setNewCommentValue("");
      setNewImage(null);
      setNewImagePreview(null);
    } catch (error) {
      alert(`${error}`);
    } finally {
      setIsEditingComment(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setNewCommentValue("");
    setNewImage(null);
    setNewImagePreview(null);
  };

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("Comments")
        .select("id, blog_id, user_id, author, content, created_at, image_url")
        .eq("blog_id", selectedBlogId)
        .order("created_at", { ascending: true });

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

        <CommentInput
          commentBoxValue={commentBoxValue}
          setCommentBoxValue={setCommentBoxValue}
          handleImageChange={(e) =>
            handleImageChange(e, setImage, setImagePreview)
          }
          emojiPickerRef={emojiPickerRef}
          showPicker={showPicker}
          setShowPicker={setShowPicker}
          handleEmojiClick={(e) => handleEmojiClick(e, setCommentBoxValue)}
          isLoading={isLoading}
          imagePreview={imagePreview}
          handleSubmitComment={handleSubmitComment}
        />

        {imagePreview && (
          <ImagePrev
            handleRemoveImage={() =>
              handleRemoveImage(setImage, setImagePreview)
            }
            imagePreview={imagePreview}
            imageName={image?.name}
          />
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
            {editingCommentId !== comment.id ? (
              <div className="group flex justify-between">
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

                <div className="flex content-center items-center text-gray-600">
                  {session?.user.id === comment.user_id && (
                    <CommentActions
                      items={[
                        {
                          label: "Edit",
                          onClick: () => {
                            setEditingCommentId(comment.id);
                            setNewCommentValue(comment.content);
                            setNewImagePreview(comment.image_url || null);
                          },
                        },
                        {
                          label: "Delete",
                          onClick: () => {
                            handleDeleteComment(comment.id, comment.image_url);
                          },
                        },
                      ]}
                    />
                  )}
                </div>
              </div>
            ) : (
              <>
                <CommentInput
                  commentBoxValue={newCommentValue}
                  setCommentBoxValue={setNewCommentValue}
                  handleImageChange={(e) =>
                    handleImageChange(e, setNewImage, setNewImagePreview)
                  }
                  emojiPickerRef={emojiPickerRef}
                  showPicker={showPicker}
                  setShowPicker={setShowPicker}
                  handleEmojiClick={(e) =>
                    handleEmojiClick(e, setNewCommentValue)
                  }
                  isLoading={isEditingComment}
                  imagePreview={newImagePreview}
                  handleSubmitComment={() =>
                    handleEditComment(
                      comment.id,
                      comment.content,
                      comment.image_url,
                    )
                  }
                  placeholder=""
                  inputId="image-update"
                  isEditing={true}
                  hasChanges={
                    newCommentValue !== comment.content ||
                    newImagePreview !== comment.image_url
                  }
                />

                {newImagePreview && (
                  <ImagePrev
                    handleRemoveImage={() =>
                      handleRemoveImage(setNewImage, setNewImagePreview)
                    }
                    imagePreview={newImagePreview}
                  />
                )}

                <button
                  onClick={handleCancelEdit}
                  className="px-1 py-1.5 text-sm text-blue-500 font-medium hover:underline rounded-lg transition"
                >
                  Cancel
                </button>
              </>
            )}
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
