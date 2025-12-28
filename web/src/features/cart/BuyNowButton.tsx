"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/features/cart/cart-context";
import type { Product } from "@/types/product";

interface BuyNowButtonProps {
  product: Product;
  disabled?: boolean;
}

export default function BuyNowButton({
  product,
  disabled,
}: BuyNowButtonProps) {
  const router = useRouter();
  const { dispatch } = useCart();

  const handleBuyNow = () => {
    if (disabled) return;

    dispatch({
      type: "ADD",
      payload: {
        productId: product._id || product.id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        image: product.images?.[0],
        quantity: 1,
      },
    });

    router.push("/cart");
  };

  return (
    <button
      onClick={handleBuyNow}
      disabled={disabled}
      className="h-10 px-5 border border-cyan-400/40 bg-cyan-500 text-black font-bold
                 hover:shadow-[0_0_20px_rgba(0,247,255,0.5)]
                 disabled:opacity-40"
    >
      Mua ngay
    </button>
  );
}
