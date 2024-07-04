import Image from "next/image";
import { notFound } from "next/navigation";
import { AddCart } from "./_components/AddCart";
import { Reviews } from "./_components/Reviews";
import { getProductById } from "@/app/api/supabase/product";

interface ProductPageProps {
	params: { id: string }
}

export default async function ProductPage({ params }: ProductPageProps) {
	const { data, error } = await getProductById(params.id)

	if (!data || error) {
		notFound();
	}

	return (
		<div>
			<div className="flex gap-x-2">
				<div className="w-80 h-96 relative">
					<Image src={data.image_url} alt={data.name} fill objectFit="cover" />
				</div>
				<div className="flex flex-col gap-y-1 text-sm font-semibold p-2">
					<div>상품명: {data.name}</div>
					<div>가격: {data.price}원</div>
					<AddCart product={data} />
				</div>
			</div>
			<div>
				<Reviews />
			</div>
		</div>
	)
}