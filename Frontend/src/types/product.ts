export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category?: {
    _id: string;
    name: string;
  };
}