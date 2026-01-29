import type { ReactNode } from "react";

export interface BlogTypes {
  id: string;
  created_at: string;
  title: string;
  user_id: string;
  content: string;
  author: string;
  image_url?: string | null;
}

export interface CreateBlogTypes {
  title: string;
  content: string;
}

export interface EditBlogTypes {
  title: string;
  content: string;
  image_url?: string | null;
}

export interface CommentTypes {
  id: string;
  blog_id: string,
  user_id: string,
  created_at: string;
  content: string;
  author: string;
  image_url: string | null;
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
