import { RowDataPacket } from "mysql2";

export interface ProductRow extends RowDataPacket {
  product_id: number;
  brand: string;
  category: string;
  product_name: string;
  description: string;
  price: number;
  available_count: number | null;
  rating: number | null;
  review: string | null;
  comments: string | null;
  updated_at: string | null;
}

export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface UserData {
  username: string;
  password: string;
  customerName: string;
  mobileNumber: string;
}

export interface DisplayProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
}

export interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export interface UserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export interface FormData {
  username: string;
  password: string;
  customerName: string;
  mobileNumber: string;
  city: string;
  state: string;
  country: string;
}

export interface UserData extends RowDataPacket {
  username: string;
  customer_name: string;
  mobile_number: string;
  city: string;
  state: string;
  country: string;
  product_name: string;
  price: number;
  product_id: string;
  created_at: string;
}

export interface CartCount extends RowDataPacket {
  totalCartItems: number;
}
