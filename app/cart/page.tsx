// app/cart/page.tsx

"use client";

import { createClient } from "@/utils/supabase/client";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CartItem } from "./_components/CartItem";
import { CartWithProduct } from "@/types/types";
import { getCurrentUser } from "../api/supabase/user";

export default function CartPage() {
	const [cartProducts, setCartProducts] = useState<CartWithProduct[]>([]);
	const router = useRouter();

	useEffect(() => {
		const fetchProducts = async () => {
			const { user } = await getCurrentUser();

			if (user) {
				const { data, error } = await createClient().from("cart").select("*, product:product_id(*)").eq("user_id", user.id)

				if (error) {
					notFound();
				}

				setCartProducts(data || []);
			}
		}
		fetchProducts();
	}, [router]);

	return (
		<div>
			<h1 className="text-xl font-bold">
				장바구니
			</h1>
			<ul>
				{cartProducts.map((cartProduct) => (
					<CartItem key={cartProduct.id} cartProduct={cartProduct} setCartProducts={setCartProducts} />
				))}
			</ul>
			{/* 총 가격 */}
			<div className="font-bold">
				총 비용: {cartProducts.reduce((acc, curr) => acc + curr.product.price * curr.count, 0).toLocaleString()}원
			</div>
		</div>
	)
}