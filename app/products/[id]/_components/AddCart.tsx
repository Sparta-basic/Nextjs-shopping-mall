"use client";

import { Product } from "@/types/types";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { addCartProduct, getCartProductByProductId, updateCartProductCount } from "@/app/api/supabase/cart";
import { getCurrentUser } from "@/app/api/supabase/user";

interface AddCartProps {
	product: Product;
}

export function AddCart({ product }: AddCartProps) {
	const [count, setCount] = useState(1);
	const router = useRouter();

	const onAddCount = () => {
		setCount(count + 1);
	}

	const onSubtractCount = () => {
		if (count > 1) {
			setCount(count - 1);
		}
	}

	const onAddCart = async () => {
		const { user, error: userError } = await getCurrentUser();
		if (userError || !user) {
			alert("로그인을 해주세요.");
			router.push("/auth/login");
			return;
		}

		// maybeSingle 메소드 vs single 메소드의 차이를 알아보세요.
		const { data, error: cartError } = await getCartProductByProductId({ id: product.id, userId: user.id });

		if (cartError) {
			alert("장바구니에 담기 중 에러가 발생했습니다.");
			return;
		}

		if (!data) {
			const { error } = await addCartProduct({ productId: product.id, userId: user.id, count });
			if (error) {
				alert("장바구니에 담기 중 에러가 발생했습니다.");
				return;
			}
		} else {
			const { error } = await updateCartProductCount({ id: data.id, count: data.count + count });
			if (error) {
				console.log({ error })
				alert("장바구니에 담기 중 에러가 발생했습니다.");
				return;
			}
		}

		const isConfirmed = confirm("장바구니에 담겼습니다. 장바구니로 이동하시겠습니까?");
		if (isConfirmed) {
			router.push("/cart");
		}
	}

	return (
		<>
			<div className="flex gap-x-2 items-center">
				수량:
				<button
					onClick={onSubtractCount}
					className="border px-3 py-1 border-black rounded-sm">
					-
				</button>
				<span>{count}</span>
				<button
					onClick={onAddCount}
					className="border px-3 py-1 border-black rounded-sm">
					+
				</button>
			</div>
			<button
				onClick={onAddCart}
				className="border px-3 py-1 bg-blue-500 text-white rounded-sm">장바구니에 담기</button>
		</>
	)
}