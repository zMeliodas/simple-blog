import { useState, type ChangeEvent } from "react";
import { supabase } from "../services/supabaseClient";
import { Link } from "react-router-dom";
import { type CreateBlogTypes } from "../types/types";
import { uploadBlogImage } from "../utils/ImageHandling";
import { MdCloudUpload, MdClose } from "react-icons/md";
import CustomSpinner from "../common/CustomSpinner";

const CreateBlog = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];

      if (!validTypes.includes(file.type)) {
        alert("Please upload a valid image file (PNG, JPG, or JPEG)");
        return;
      }

      const fileSizeMB = file.size / (1024 * 1024);
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

  const removeImage = (): void => {
    setImage(null);
    setImagePreview(null);
  };

  const [blogInfo, setBlogInfo] = useState<CreateBlogTypes>({
    title: "",
    content: "",
  });

  const createBlog = async () => {
    setIsLoading(true);
    if (!blogInfo.title.trim()) {
      alert("Blog title cannot be empty!");
      return;
    }

    if (!blogInfo.content.trim()) {
      alert("Blog content cannot be empty!");
      return;
    }

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
        imageUrl = await uploadBlogImage(image);
        if (!imageUrl) {
          alert("Failed to upload image");
          return;
        }
      }

      const { error } = await supabase.from("Blogs").insert({
        title: blogInfo.title,
        content: blogInfo.content,
        author: user.user_metadata.full_name,
        image_url: imageUrl,
      });

      if (error) throw error;

      alert("Blog published successfully!");
      setBlogInfo({
        title: "",
        content: "",
      });
      removeImage();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-backgroundColor flex flex-col w-screen items-center gap-4 h-screen pt-24 overflow-auto">
      <div className="bg-backgroundColor w-full max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Create New Blog Post
        </h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Blog Title
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your blog title..."
              value={blogInfo.title}
              onChange={(e) => {
                setBlogInfo((prev) => ({
                  ...prev,
                  title: e.target.value,
                }));
              }}
            />
          </div>

          <div className="mb-4">
            <div className="max-w-2xl mx-auto">
              <label className="block text-gray-700 font-semibold mb-2">
                Blog Image
              </label>

              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
                  <input
                    type="file"
                    id="image-upload"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <MdCloudUpload className="w-12 h-12 text-gray-400 mb-3" />
                    <span className="text-gray-600 font-medium mb-1">
                      Click to upload image
                    </span>
                    <span className="text-gray-400 text-sm">
                      PNG, JPG, JPEG, up to 50MB
                    </span>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-1000 object-contain rounded-lg z-0"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <MdClose className="w-5 h-5" />
                  </button>
                  <div className="mt-2 text-sm text-gray-700">
                    {image?.name}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Blog Content
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-64"
              placeholder="Write your blog content here..."
              value={blogInfo.content}
              onChange={(e) => {
                setBlogInfo((prev) => ({
                  ...prev,
                  content: e.target.value,
                }));
              }}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={createBlog}
              disabled={isLoading}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition font-medium"
            >
              <p className="flex gap-1 item-center content-center">
                {isLoading ? (
                  <>
                    <CustomSpinner color="color-white" />{" "}
                    <span>Publishing...</span>
                  </>
                ) : (
                  <span>Publish Blog</span>
                )}
              </p>
            </button>
            <Link
              to="/home"
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
