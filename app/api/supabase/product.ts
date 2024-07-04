import { createClient } from "@/utils/supabase/server";
import { Product } from "@/types/types";
import { PostgrestError } from "@supabase/supabase-js";

type ProductsResponse = {
  data: Product[] | null;
  error: PostgrestError | null;
};

export async function getProducts(): Promise<ProductsResponse> {
  const { data, error } = await createClient().from("products").select("*");

  return { data: data, error: error };
}

type ProductResponse = {
  data: Product | null;
  error: PostgrestError | null;
};

export async function getProductById(id: string): Promise<ProductResponse> {
  const { data, error } = await createClient()
    .from("products")
    .select("*")
    .eq("id", id)
    .limit(1)
    .single();

  return { data: data, error: error };
}
