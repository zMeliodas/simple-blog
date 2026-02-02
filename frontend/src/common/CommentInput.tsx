import { IoCameraOutline } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import type { CommentInputProps } from "../types/types";

const CommentInput = ({
  commentBoxValue,
  setCommentBoxValue,
  handleImageChange,
  emojiPickerRef,
  showPicker,
  setShowPicker,
  handleEmojiClick,
  isLoading,
  imagePreview,
  handleSubmitComment,
  isEditing = false,
  hasChanges = true,
  placeholder = "Share your thoughts...",
  inputId = "image-upload",
}: CommentInputProps) => {
    
  const isDisabled = isEditing
    ? isLoading || !hasChanges
    : isLoading || (!commentBoxValue && !imagePreview);

  return (
    <div className="flex flex-col mb-1 border border-gray-300 rounded-xl">
      <textarea
        className="w-full px-4 py-2 border-gray-300 rounded-md focus:ring-1 focus:ring-transparent focus:border-transparent min-h-18 outline-none resize-none"
        value={commentBoxValue}
        onChange={(e) => setCommentBoxValue(e.target.value)}
        placeholder={placeholder}
      />

      <div className="flex flex-row justify-between content-center items-center mt-1 mx-1 mb-1">
        <div className="flex content-center items-center">
          <label
            htmlFor={inputId}
            className="hover:bg-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed text-indigo-600 pr-7.5 pl-1.5 py-1.5 w-8 rounded-full font-medium transition"
          >
            <IoCameraOutline className="w-6 h-6" />
          </label>
          <input
            type="file"
            id={inputId}
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
                  onEmojiClick={handleEmojiClick}
                  width={300}
                  height={400}
                  previewConfig={{ showPreview: false }}
                  searchDisabled={true}
                />
              </div>
            )}
          </div>
        </div>

        <button
          disabled={isDisabled}
          onClick={handleSubmitComment}
          className="hover:bg-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed text-indigo-600 pl-2.5 p-2 w-8 rounded-full font-medium transition"
        >
          <IoSend aria-label="Send comment" />
        </button>
      </div>
    </div>
  );
};

export default CommentInput;
