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
  const {
    title,
    price,
    slug,
    images,
    stock,
    brand,
    rating,
    description,
  } = product;

  const imageSrc =
    Array.isArray(images) && images[0] ? images[0] : "/ham.png";

  const outOfStock = (stock ?? 0) <= 0;
  const isDeal = (price ?? 0) < 150000;

  return (
    <motion.div
      className="group relative mx-auto w-full max-w-sm"
      /* ================= RUNG DỮ DỘI ================= */
      whileHover={{
        scale: 1.05,
        x: [0, -3, 3, -3, 3, 0],
        y: [0, 2, -2, 2, -2, 0],
        rotateZ: [0, -1.5, 1.5, -1.5, 1.5, 0],
      }}
      transition={{
        duration: 0.25,
        repeat: Infinity,
        repeatType: "loop",
      }}
    >
      {/* ⚡ ELECTRIC BORDER */}
      <div className="pointer-events-none absolute inset-[-3px] rounded-[30px] electric-border opacity-0 group-hover:opacity-100 transition-opacity duration-100" />

      {/* ================= CARD BODY ================= */}
      <div className="relative overflow-hidden rounded-[28px] border border-gray-200 bg-white">
        <Link href={`/shop/${slug}`}>
          {/* ================= IMAGE ================= */}
          <div className="relative aspect-square overflow-hidden">
            {/* ⚡ LIGHTNING */}
            <span className="lightning l1" />
            <span className="lightning l2" />
            <span className="lightning l3" />

            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-cover"
            />

            {outOfStock && (
              <span className="absolute left-3 top-3 z-10 rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white">
                HẾT HÀNG
              </span>
            )}

            {isDeal && !outOfStock && (
              <span className="deal-badge absolute right-3 top-3 z-10 rounded-full bg-yellow-400 px-4 py-1 text-xs font-black text-black">
                DEAL ⚡
              </span>
            )}
          </div>

          {/* ================= CONTENT ================= */}
          <div className="p-6">
            <h3 className="text-sm font-extrabold line-clamp-2">
              {title}
            </h3>

            <p className="mt-2 text-xs text-gray-500 line-clamp-2">
              {description}
            </p>

            <div className="mt-4 text-xl font-black text-yellow-500">
              {formatVND(price)}
            </div>

            <div className="mt-2 flex gap-3 text-xs text-gray-500">
              {brand && <span>{brand}</span>}
              {typeof rating === "number" && <span>★ {rating}</span>}
            </div>

            <div className="mt-6">
              <AddToCartButton
                product={product}
                disabled={outOfStock}
              />
            </div>
          </div>
        </Link>
      </div>

      {/* ================= STYLES ================= */}
      <style jsx>{`
        /* ===== ELECTRIC BORDER ===== */
        .electric-border {
          background: linear-gradient(
            120deg,
            transparent 30%,
            #ffffff 40%,
            #facc15 50%,
            #ec4899 60%,
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

        /* ===== LIGHTNING ===== */
        .lightning {
          position: absolute;
          inset: 0;
          opacity: 0;
          background: linear-gradient(
            90deg,
            transparent 45%,
            white 50%,
            transparent 55%
          );
          clip-path: polygon(
            50% 0%,
            55% 15%,
            45% 30%,
            60% 45%,
            40% 60%,
            55% 75%,
            50% 100%
          );
          filter: drop-shadow(0 0 16px white);
        }

        .group:hover .lightning {
          animation: strike 0.2s infinite;
        }

        .l2 {
          animation-delay: 0.06s;
        }

        .l3 {
          animation-delay: 0.12s;
        }

        @keyframes strike {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        /* ===== DEAL BADGE (CỰC MẠNH) ===== */
        .deal-badge {
          animation: dealCrazy 0.2s infinite;
        }

        @keyframes dealCrazy {
          0% {
            transform: scale(1) rotate(0deg);
          }
          25% {
            transform: scale(1.25) rotate(-10deg);
          }
          50% {
            transform: scale(0.9) rotate(10deg);
          }
          75% {
            transform: scale(1.3) rotate(-12deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
          }
        }
      `}</style>
    </motion.div>
  );
}
