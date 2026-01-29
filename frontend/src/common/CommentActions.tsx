import { useState, useEffect, useRef } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { type MenuItem } from "../types/types";

const CommentActions = ({ items }: { items: MenuItem[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="p-2 hover:bg-gray-300 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiMoreHorizontal className="w-5 h-5 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-backgroundColor rounded-2xl shadow-lg">
          {items.map((item, index) => (
            <button
              key={index}
              className="w-full px-4 py-2 text-left hover:bg-gray-200 first:rounded-t-2xl last:rounded-b-2xl"
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentActions;
