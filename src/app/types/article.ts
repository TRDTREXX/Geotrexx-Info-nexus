export interface Article {
  _id?: string;
  title?: string;
  slug?: any;
  category?: string;
  publishedAt?: string;
  mainImage?: any;
  authorName?: string;
  authorImage?: any;
  authorBio?: any;
  summary?: any;
  body?: any;
  [key: string]: any;
}