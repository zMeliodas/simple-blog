import { useState, type ChangeEvent } from "react";
import { useAppSelector } from "../redux/store.ts";
import { useEffect } from "react";
import { supabase } from "../services/supabaseClient.ts";
import { useNavigate, Link } from "react-router-dom";
import { type EditBlogTypes } from "../types/types.ts";
import { MdCloudUpload, MdClose } from "react-icons/md";
import { uploadImage, deleteImage } from "../utils/ImageHandling.ts";
import CustomSpinner from "../common/CustomSpinner.tsx";

const EditBlog = () => {
  const navigate = useNavigate();
  const { selectedBlogId } = useAppSelector((state) => state.blog);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageRemoved, setImageRemoved] = useState<boolean>(false);

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
      setImageRemoved(false);

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
    setImageRemoved(true);
  };

  const [updatedBlog, setUpdatedBlog] = useState<EditBlogTypes>({
    title: "",
    content: "",
    image_url: "",
  });

  const [blog, setBlog] = useState<EditBlogTypes>({
    title: "",
    content: "",
    image_url: "",
  });

  const handleEditBlog = async () => {
    if (
      updatedBlog.title === blog.title &&
      updatedBlog.content === blog.content &&
      !image &&
      !imageRemoved
    ) {
      alert("No changes detected.");
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = blog.image_url;

      // If a new image is uploaded
      if (imageRemoved) {
        const confirmed = window.confirm(
          "Are you sure you want to update the blog without image?",
        );

        if (!confirmed) return;

        if (blog.image_url) {
          await deleteImage(blog.image_url);
        }

        imageUrl = null;
      } else if (image) {
        // Delete old image if it exists
        if (blog.image_url) {
          await deleteImage(blog.image_url);
        }

        // Upload new image
        const newImageUrl = await uploadImage(image, "blogs");

        if (!newImageUrl) {
          alert("Failed to upload image");
          setIsLoading(false);
          return;
        }

        imageUrl = newImageUrl;
      }

      const { error } = await supabase
        .from("Blogs")
        .update({
          title: updatedBlog.title,
          content: updatedBlog.content,
          image_url: imageUrl,
        })
        .eq("id", selectedBlogId)
        .select();

      if (error) throw error;

      alert("Blog updated successfully");
      navigate("/viewBlog");
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedBlogId) {
      navigate("/home");
      return;
    }

    const fetchSelectedBlog = async () => {
      try {
        const { data, error } = await supabase
          .from("Blogs")
          .select("id, title, author, created_at, content, image_url")
          .eq("id", selectedBlogId)
          .single();

        if (data) {
          setBlog(data);
          setUpdatedBlog(data);
          setImagePreview(data.image_url);
        }

        if (error) throw error;
      } catch (error) {
        alert(error);
      }
    };

    fetchSelectedBlog();
  }, [selectedBlogId]);

  return (
    <div className="bg-backgroundColor flex flex-col items-center gap-4 w-screen h-screen pt-24">
      <div className="w-full max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Edit Blog Post
        </h2>
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Blog Title
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={updatedBlog.title}
              onChange={(e) => {
                setUpdatedBlog((prev) => ({
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
              value={updatedBlog.content}
              onChange={(e) => {
                setUpdatedBlog((prev) => ({
                  ...prev,
                  content: e.target.value,
                }));
              }}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleEditBlog}
              disabled={isLoading}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition font-medium"
            >
              {isLoading ? (
                <>
                  <CustomSpinner color="color-white" /> <span>Updating...</span>
                </>
              ) : (
                <span>Update Blog</span>
              )}
            </button>
            <Link
              to="/viewBlog"
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

export default EditBlog;
