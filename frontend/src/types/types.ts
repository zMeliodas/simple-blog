import type { ReactNode, ChangeEvent } from "react";

export interface BlogTypes {
  id: string;
  created_at: string;
  title: string;
  user_id?: string;
  content: string;
  author: string;
  image_url?: string | null;
}

export interface CreateBlogTypes {
  title: string;
  content: string;
  image_url?: string | null;
}

export interface PaginationTypes {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  previous: ReactNode;
  next: ReactNode;
}

export interface MenuItem {
  label: string;
  onClick: () => void;
}

export interface CommentInputProps {
  commentBoxValue: string;
  setCommentBoxValue: (value: string) => void;
  handleImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  emojiPickerRef: React.RefObject<HTMLDivElement | null>;
  showPicker: boolean;
  setShowPicker: (show: boolean) => void;
  handleEmojiClick: (emojiObject: any) => void;
  isLoading: boolean;
  imagePreview: string | null;
  handleSubmitComment: () => void;
  placeholder?: string;
  inputId?: string;
  isEditing?: boolean;
  hasChanges?: boolean;
}

export interface CommentTypes {
  id: string;
  blog_id: string;
  user_id: string;
  created_at: string;
  content: string;
  author: string;
  image_url: string | null;
}

export interface imagePreviewProps {
  handleRemoveImage: () => void;
  imagePreview: string;
  imageName?: string;
}
