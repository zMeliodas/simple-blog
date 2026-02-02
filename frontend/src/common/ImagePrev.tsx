import { MdClose } from "react-icons/md";
import type { imagePreviewProps } from "../types/types";

const ImagePrev = ({
  handleRemoveImage,
  imagePreview,
  imageName,
}: imagePreviewProps) => {
  return (
    <div className="relative w-54 max-w-sm">
      <div className="relative h-full w-full overflow-hidden rounded-xl bg-gray-100">
        <img
          src={imagePreview}
          alt="Preview"
          className="w-full h-full object-fill rounded-lg z-0"
        />

        <button
          onClick={handleRemoveImage}
          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
        >
          <MdClose className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-1 text-sm text-gray-700">{imageName}</div>
    </div>
  );
};

export default ImagePrev;
