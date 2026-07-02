export interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // markdown
  author: string;
  published_at: string; // ISO date
  views: number;
}

export interface PostWithLikes extends Post {
  likes: number;
}
