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
  created_at: string;
  blog_id: string;
  user_id: string;
  content: string;
  author: string;
}
