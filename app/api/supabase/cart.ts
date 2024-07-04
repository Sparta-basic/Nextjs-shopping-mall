// app/api/supabase/cart.ts

import { Cart } from "@/types/types";
import { createClient } from "@/utils/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";

type CartProductByProductIdParams = {
  id: string;
  userId: string;
};

type CartProductByProductIdResponse = {
  data: Cart | null;
  error: PostgrestError | null;
};

export async function getCartProductByProductId({
  id,
  userId,
}: CartProductByProductIdParams): Promise<CartProductByProductIdResponse> {
  const { data, error } = await createClient()
    .from("cart")
    .select("*")
    .eq("product_id", id)
    .eq("user_id", userId)
    .maybeSingle();
  return { data, error };
}

type AddCartProductParams = {
  productId: string;
  userId: string;
  count: number;
};

export async function addCartProduct({
  productId,
  userId,
  count,
}: AddCartProductParams) {
  const { error } = await createClient().from("cart").insert({
    product_id: productId,
    user_id: userId,
    count,
  });

  return { error };
}

type UpdateCartProductCountParams = {
  id: string;
  count: number;
};

export async function updateCartProductCount({
  id,
  count,
}: UpdateCartProductCountParams) {
  const { error } = await createClient()
    .from("cart")
    .update({ count })
    .eq("id", id);
  return { error };
}
