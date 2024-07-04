// app/cart/_components/CartItem.tsx

"use client";

import { CartWithProduct } from "@/types/types";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";


export function CartItem({
	cartProduct,
	setCartProducts
}: {
	cartProduct: CartWithProduct,
	setCartProducts: Dispatch<SetStateAction<CartWithProduct[]>>;
}) {
	// 1. + 버튼 클릭 시 id 가 일치하는 놈의 count를 증가시킨다.
	const handlePlusChange = async () => {
		setCartProducts((prev) => prev.map((p) => p.id === cartProduct.id ? { ...p, count: cartProduct.count + 1 } : p));
		const { error } = await createClient().from("cart").update({ count: cartProduct.count + 1 }).eq("id", cartProduct.id);
		if (error) {
			alert(error.message);
		}
	}

	const handleMinusChange = async () => {
		if (cartProduct.count > 1) {
			setCartProducts((prev) => prev.map((p) => p.id === cartProduct.id ? { ...p, count: cartProduct.count - 1 } : p))
			const { error } = await createClient().from("cart").update({ count: cartProduct.count - 1 }).eq("id", cartProduct.id);
			if (error) {
				alert(error.message);
			}
		}
	}

	return (
		<li
			key={cartProduct.id}
			className="flex gap-4 mb-2 border"
		>
			<div>
				<Image
					src={cartProduct.product.image_url}
					width={100}
					height={100}
					alt={cartProduct.product.name}
				/>
			</div>
			<div>
				<div>상품명: {cartProduct.product.name}</div>
				<div>설명: {cartProduct.product.description}</div>
				<div>
					<span>개수: </span>
					<button onClick={handleMinusChange}>-</button>
					{cartProduct.count}
					<button onClick={handlePlusChange}>+</button>
				</div>
				<div>가격: {cartProduct.product.price.toLocaleString()}원</div>
				<div>총 가격: {(cartProduct.product.price * cartProduct.count).toLocaleString()}원</div>
			</div>
		</li>
	)
}