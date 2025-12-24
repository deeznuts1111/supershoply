import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { Terminal, ChevronRight } from "lucide-react";

export const metadata: Metadata = { 
  title: "Shop — Phúc Sigma",
  description: "Khám phá kho công nghệ tiên tiến với hàng ngàn sản phẩm chất lượng cao"
};

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") || "/shop";
  const isDetail = pathname.startsWith("/shop/") && pathname.split("/").length > 2;

  return (
    <section className="relative">
      {/* Breadcrumb - Futuristic Style */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="relative inline-flex items-center gap-2 px-4 py-2 bg-[#0a1628]/60 backdrop-blur-md border border-cyan-500/30 overflow-hidden group hover:border-cyan-400/60 transition-all">
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-400" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan-400" />
          
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-500" />
          
          <Terminal size={14} className="text-cyan-400 relative z-10" />
          
          <nav className="flex items-center gap-2 text-xs font-bold tracking-wider relative z-10">
            <Link 
              className="text-gray-400 hover:text-cyan-400 transition-colors uppercase" 
              href="/"
            >
              Home
            </Link>
            
            <ChevronRight size={12} className="text-gray-600" />
            
            <Link 
              className={`${isDetail ? 'text-gray-400 hover:text-cyan-400' : 'text-cyan-400'} transition-colors uppercase`}
              href="/shop"
            >
              Shop
            </Link>
            
            {isDetail && (
              <>
                <ChevronRight size={12} className="text-gray-600" />
                <span className="text-white uppercase">Product Detail</span>
              </>
            )}
          </nav>
        </div>
      </div>

      {children}
    </section>
  );
}
