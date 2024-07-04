import { notFound } from "next/navigation";
import { getProducts } from "./api/supabase/product";
import Link from "next/link";
import Image from "next/image";


export default async function Home() {
  const { data, error } = await getProducts();

  if (!data || error) {
    notFound();
  }

  return (
    <main>
      <div className="flex gap-x-12">
        {data.map((item) => {
          return (
            <Link href={`/products/${item.id}`} key={item.id} className="border w-48 h-auto">
              <div className="w-full h-48 relative">
                <Image
                  priority
                  src={item.image_url} alt={item.name} fill />
              </div>
              <div className="flex flex-col gap-y-1 text-sm font-semibold p-2">
                <div>상품명: {item.name}</div>
                <div>가격: {item.price}원</div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
