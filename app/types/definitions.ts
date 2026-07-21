import { RowDataPacket } from "mysql2";

export interface ProductRow extends RowDataPacket {
  product_id: number;
  brand: string;
  category: string;
  product_name: string;
  price: number;
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

export interface DisplayProduct extends Product {
  brand: string;
  rating: number;
}

export interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}
