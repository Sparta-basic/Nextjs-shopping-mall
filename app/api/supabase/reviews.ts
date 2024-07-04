import { Review } from "@/types/types";
import { createClient } from "@/utils/supabase/client";

// products.ts 와 에러 처리가 다른 이유는 다양한 상황을 보여주기 위함
// useQuery에서 error를 인식하기 위해서 throw 처리를 해야한다.
export async function getReviews(productId: string): Promise<Review[] | null> {
  const { data, error } = await createClient()
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export type AddReviewParams = {
  content: string;
  productId: string;
  email: string;
  userId: string;
};

export async function addReview({
  content,
  productId,
  email,
  userId,
}: AddReviewParams) {
  const { error } = await createClient().from("reviews").insert({
    content,
    product_id: productId,
    email,
    user_id: userId,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteReview(id: string) {
  const { error } = await createClient().from("reviews").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export type EditReviewParams = {
  id: string;
  content: string;
};

export async function editReview({ id, content }: EditReviewParams) {
  const { error } = await createClient()
    .from("reviews")
    .update({ content })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
