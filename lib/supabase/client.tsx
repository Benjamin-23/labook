import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database schema
export type Book = {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publication_date: string;
  genre: string;
  description: string;
  cover_image: string;
  page_count: number;
  language: string;
  created_at: string;
  updated_at: string;
};

export type InventoryItem = {
  id: string;
  book_id: string;
  quantity: number;
  location: string;
  condition: string;
  cost_price: number;
  selling_price: number;
  is_for_sale: boolean;
  is_for_loan: boolean;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "librarian" | "customer";
  phone_number: string;
  address: string;
  created_at: string;
  updated_at: string;
};

export type Loan = {
  id: string;
  book_id: string;
  user_id: string;
  checkout_date: string;
  due_date: string;
  return_date: string | null;
  status: "active" | "overdue" | "returned";
  created_at: string;
  updated_at: string;
};

export type Sale = {
  id: string;
  user_id: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
};

export type SaleItem = {
  id: string;
  sale_id: string;
  book_id: string;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
};

export type PurchaseOrder = {
  id: string;
  supplier_id: string;
  order_date: string;
  expected_delivery: string;
  status: "pending" | "delivered" | "cancelled";
  total_amount: number;
  created_at: string;
  updated_at: string;
};

export type PurchaseItem = {
  id: string;
  purchase_id: string;
  book_id: string;
  quantity: number;
  cost_price: number;
  created_at: string;
  updated_at: string;
};

export type Supplier = {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
};
