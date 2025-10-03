export interface Articles {
  page: number;
  limit: number;
  total: number;
  items: Item[];
}

export interface Item {
  _id: string;
  contentHash: string;
  __v: number;
  authors: string[];
  categories: string[];
  createdAt: Date;
  fetchedAt: Date;
  imageUrl: string;
  publishedAt: Date;
  source: string;
  summary: string;
  content: string;
  title: string;
  updatedAt: Date;
  url: string;
}
