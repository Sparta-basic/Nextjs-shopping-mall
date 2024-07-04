// types/types.ts

import { Tables } from "./supabase";

export type Product = Tables<"products">;

export type Cart = Tables<"cart">;
export type CartWithProduct = Cart & {
  product: Product;
};

export type Review = Tables<"reviews">;
