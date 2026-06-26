export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: ArticleCategory;
  imageUrl: string;
  author: string;
  isBreaking: boolean;
  isFeatured: boolean;
  views: number;
  likes: number;
  status: "draft" | "review" | "published";
  scheduledAt: number | null;
  tags: string[];
  videoUrl: string;
  createdAt: number;
  updatedAt: number;
}

export type ArticleCategory =
  | "desh"
  | "world"
  | "politics"
  | "sports"
  | "business"
  | "entertainment"
  | "health"
  | "tech"
  | "opinion"
  | "lifestyle";

export interface Category {
  id: ArticleCategory;
  name: string;
  nameEn: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: "desh", name: "देश", nameEn: "National", color: "#dc2626" },
  { id: "world", name: "विश्व", nameEn: "World", color: "#7c3aed" },
  { id: "politics", name: "राजनीति", nameEn: "Politics", color: "#b91c1c" },
  { id: "sports", name: "खेलकुद", nameEn: "Sports", color: "#16a34a" },
  { id: "business", name: "अर्थ/बजार", nameEn: "Business", color: "#d4a017" },
  { id: "entertainment", name: "मनोरञ्जन", nameEn: "Entertainment", color: "#db2777" },
  { id: "health", name: "स्वास्थ्य", nameEn: "Health", color: "#0891b2" },
  { id: "tech", name: "प्रविधि", nameEn: "Technology", color: "#2563eb" },
  { id: "opinion", name: "विचार", nameEn: "Opinion", color: "#475569" },
  { id: "lifestyle", name: "जीवन/शैली", nameEn: "Lifestyle", color: "#ea580c" },
];

export interface Ad {
  id: string;
  imageUrl: string;
  linkUrl: string;
  title: string;
  position: "homepage_top" | "homepage_sidebar" | "category_top" | "article_inline" | "sticky_bottom" | "homepage_infeed";
  active: boolean;
  clicks: number;
  createdAt: number;
}
export interface Comment {
  id: string;
  articleId: string;
  userName: string;
  userPhoto: string;
  text: string;
  createdAt: number;
}
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "editor" | "reporter";
  createdAt: number;
}