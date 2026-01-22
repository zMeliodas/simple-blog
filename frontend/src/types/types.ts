export interface BlogTypes {
  id: string;
  created_at: string;
  title: string;
  content: string;
  author: string;
}

export interface CreateBlogTypes {
  title: string;
  content: string;
}