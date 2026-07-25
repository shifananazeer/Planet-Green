export interface Category {
  _id?: string;
  name: string;
  description?: string;
  image?: string;
  status?: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}