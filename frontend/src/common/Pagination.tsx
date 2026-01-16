import type { ReactNode } from "react";

interface PaginationTypes {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  previous: ReactNode;
  next: ReactNode;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  previous,
  next,
}: PaginationTypes) => {
  return (
    <div className="flex mt-8 items-center justify-center gap-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-lg font-medium ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
        {previous}
      </button>

      <div className="px-2 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700">
        {currentPage} / {totalPages}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-lg font-medium ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
        {next}
      </button>
    </div>
  );
};

export default Pagination;
