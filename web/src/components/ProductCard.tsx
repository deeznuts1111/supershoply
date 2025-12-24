"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/types/product";
import { formatVND } from "@/lib/format";
import AddToCartButton from "@/features/cart/AddToCartButton";

export type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { title, price, slug, images, stock, brand, rating, description } =
    product;

  const imageSrc =
    Array.isArray(images) && images[0] ? images[0] : "/ham.png";

  const outOfStock = (stock ?? 0) <= 0;
  const isDeal = (price ?? 0) < 150000;

  return (
    <motion.div
      className="group relative mx-auto w-full max-w-sm"
      whileHover={{
        scale: 1.05,
        rotateZ: [0, -1, 1, -1, 1, 0],
      }}
      transition={{ duration: 0.3 }}
    >
      {/* ELECTRIC BLUE BORDER */}
      <div className="pointer-events-none absolute inset-[-3px] rounded-[30px] electric-border opacity-0 group-hover:opacity-100 transition-opacity duration-150" />

      <div className="relative overflow-hidden rounded-[28px] border border-blue-100 bg-white group-hover:shadow-[0_0_40px_rgba(59,130,246,0.45)] transition-shadow duration-300">
        <Link href={`/shop/${slug}`}>
          {/* IMAGE */}
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {outOfStock && (
              <span className="absolute left-3 top-3 z-10 rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white">
                HẾT HÀNG
              </span>
            )}

            {isDeal && !outOfStock && (
              <span className="absolute right-3 top-3 z-10 rounded-full bg-blue-600 px-4 py-1 text-xs font-black text-white animate-pulse">
                DEAL ⚡
              </span>
            )}
          </div>

          {/* CONTENT */}
          <div className="p-6">
            <h3 className="text-sm font-extrabold line-clamp-2">
              {title}
            </h3>

            <p className="mt-2 text-xs text-gray-500 line-clamp-2">
              {description}
            </p>

            <div className="mt-4 text-xl font-black text-blue-600 drop-shadow-[0_0_8px_rgba(37,99,235,0.6)]">
              {formatVND(price)}
            </div>

            <div className="mt-2 flex gap-3 text-xs text-gray-500">
              {brand && <span>{brand}</span>}
              {typeof rating === "number" && <span>★ {rating}</span>}
            </div>

            <div className="mt-6">
              <AddToCartButton product={product} disabled={outOfStock} />
            </div>
          </div>
        </Link>
      </div>

      <style jsx>{`
        .electric-border {
          background: linear-gradient(
            120deg,
            transparent 30%,
            #3b82f6 40%,
            #60a5fa 50%,
            #2563eb 60%,
            transparent 70%
          );
          background-size: 300% 300%;
          animation: borderMove 0.8s linear infinite;
          filter: blur(2px);
        }

        @keyframes borderMove {
          from {
            background-position: 0% 0%;
          }
          to {
            background-position: 300% 300%;
          }
        }
      `}</style>
    </motion.div>
  );
}
