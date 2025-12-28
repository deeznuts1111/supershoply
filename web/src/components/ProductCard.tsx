"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/types/product";
import { formatVND } from "@/lib/format";
import AddToCartButton from "@/features/cart/AddToCartButton";
import { Zap, Package } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const { title, price, slug, images, stock, brand, description } = product;
  const imageSrc = Array.isArray(images) && images[0] ? images[0] : "/ham.png";
  const outOfStock = (stock ?? 0) <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -12 }}
      transition={{ duration: 0.3 }}
      className="group relative h-full"
    >
      {/* Outer Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-cyan-500/20 group-hover:via-blue-500/20 group-hover:to-purple-500/20 blur-xl transition-all duration-500 rounded-lg" />
      
      {/* Main Card */}
      <div className="relative h-full bg-gradient-to-br from-[#0a1628]/95 via-[#0d1b33]/95 to-[#0a0e27]/95 backdrop-blur-sm border border-cyan-500/20 group-hover:border-cyan-400/60 transition-all duration-300 overflow-hidden pointer-events-none">
        {/* Animated Corner Accents */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-[3px] border-l-[3px] border-cyan-400/40 group-hover:border-cyan-300 transition-all duration-300" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-[2px] border-r-[2px] border-blue-400/30 group-hover:border-blue-300 transition-all duration-300" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[2px] border-l-[2px] border-purple-400/30 group-hover:border-purple-300 transition-all duration-300" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-[3px] border-r-[3px] border-cyan-400/40 group-hover:border-cyan-300 transition-all duration-300" />

        {/* Scan Line Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 ease-in-out" />

        <Link href={`/shop/${slug}`} className="block pointer-events-auto">
          {/* Image Container with Holographic Effect */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#050b15] to-[#0a1220]">
            {/* Holographic Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,247,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,247,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-cover p-6 transition-all duration-500 group-hover:scale-105 group-hover:drop-shadow-[0_0_20px_rgba(0,247,255,0.3)]"
            />
            
            {/* Stock Badge */}
            {!outOfStock && stock !== undefined && stock < 10 && (
              <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500/90 to-orange-500/90 backdrop-blur-sm px-3 py-1.5 text-[10px] font-black text-black tracking-wider flex items-center gap-1.5 shadow-lg">
                <Zap size={12} />
                ONLY {stock} LEFT
              </div>
            )}

            {/* Out of Stock Overlay */}
            {outOfStock && (
              <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                <Package size={32} className="text-gray-500" />
                <div className="relative">
                  <span className="text-sm font-black text-white tracking-[0.3em] px-6 py-2 border-2 border-gray-500">
                    OUT OF STOCK
                  </span>
                  {/* Diagonal Lines */}
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]" />
                </div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-5 space-y-3">
            {/* Brand Badge */}
            <div className="flex items-center gap-2">
              <div className="h-[2px] w-8 bg-gradient-to-r from-cyan-400 to-transparent" />
              <span className="text-[9px] font-black text-cyan-400/90 tracking-[0.2em] uppercase">
                {brand || "SYSTEM TECH"}
              </span>
            </div>

            {/* Product Title */}
            <h3 className="text-base font-bold text-white/95 line-clamp-2 leading-snug min-h-[44px] group-hover:text-cyan-300 transition-colors duration-300">
              {title}
            </h3>

            {/* Price Section with Tech Design */}
            <div className="flex items-center justify-between pt-2">
              <div className="relative">
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400">
                  {formatVND(price)}
                </div>
                <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
              </div>
              
              {/* Tech Accent */}
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400/60 animate-pulse [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400/60 animate-pulse [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        </Link>

        {/* Add to Cart Button Section */}
        <div className="px-5 pb-5">
          <div className="relative">
            {/* Button Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div
              className="
                pointer-events-auto
                [&_button]:w-full
                [&_button]:bg-transparent
                [&_button]:text-white
                [&_button]:font-bold
                [&_button]:border
                [&_button]:border-cyan-400/40
                [&_button]:transition-all
                [&_button]:duration-200

                [&_button:hover]:bg-blue-600
                [&_button:hover]:border-blue-400
                [&_button:hover]:shadow-[0_0_15px_rgba(37,99,235,0.6)]
                [&_button:hover]:scale-[1.02]

                [&_button:disabled]:bg-transparent
                [&_button:disabled]:border-gray-600
                [&_button:disabled]:text-gray-500
                [&_button:disabled]:cursor-not-allowed
              "
              onClick={(e) => e.stopPropagation()}
            >
              <AddToCartButton product={product} disabled={outOfStock} />
            </div>

          </div>
        </div>

        {/* Bottom Tech Line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
      </div>
    </motion.div>
  );
}

