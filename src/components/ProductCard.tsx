import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatVND } from "@/lib/format";
import AddToCartButton from "@/features/cart/AddToCartButton";

export type ProductCardProps = { product: Product };

export default function ProductCard({ product }: ProductCardProps) {
  const { title, price, slug, images, stock, brand, rating, description } = product;
  const image = images?.[0] ?? "/ham.png";
  const outOfStock = (stock ?? 0) <= 0;
  const isDeal = (price ?? 0) < 150000;
  const href = `/shop/${slug}`;
  const imageSrc = Array.isArray(images) && images.length > 0 && typeof images[0] === 'string' ? images[0] : "/ham.png";

  return (
    <div className="border rounded-xl overflow-hidden bg-white hover:shadow-sm transition">
      <Link href={href} className="block">
        <div className="relative aspect-square">
          {/* Sử dụng imageSrc đã kiểm tra */}
          <Image src={imageSrc} alt={title} fill className="object-cover" />
          {outOfStock && (
            <span className="absolute left-2 top-2 text-xs bg-red-500 text-white px-2 py-1 rounded-md z-10">
              Hết hàng
            </span>
          )}
          {isDeal && (
            <span className="absolute right-2 top-2 text-xs bg-amber-500 text-white px-2 py-1 rounded-md z-10">
              Deal
            </span>
          )}
        </div>

        <div className="p-3">
          <h3 className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">{title}</h3>
          <p>{description}</p>
          <p className="mt-1 font-semibold">{formatVND(price)}</p>
          <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
            {brand && <span>{brand}</span>}
            {typeof rating === "number" && <span>★ {rating}</span>}
          </div>
          <div className="mt-3">
              <AddToCartButton product={product} disabled={outOfStock} />
          </div>
        </div>
      </Link>
    </div>
  );
}