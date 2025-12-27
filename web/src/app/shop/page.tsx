"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import SiteFooter from "@/components/SiteFooter"; 
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { Search, ChevronLeft, ChevronRight, Terminal, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const LIMIT = 12;

export default function ShopPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  const qParam = searchParams.get("q") || "";

  const [qInput, setQInput] = useState(qParam);
  useEffect(() => setQInput(qParam), [qParam]);

  const queryArgs = useMemo(
    () => ({ page: pageParam, limit: LIMIT, q: qParam || undefined }),
    [pageParam, qParam]
  );
  const { data, isLoading } = useProductsQuery(queryArgs);

  function setUrl(next: { page?: number; q?: string | null }) {
    const sp = new URLSearchParams(searchParams.toString());
    if (typeof next.page === "number") sp.set("page", String(next.page));
    if (next.q !== undefined) {
      if (next.q && next.q.trim()) {
        sp.set("q", next.q.trim());
        sp.set("page", "1");
      } else {
        sp.delete("q");
        sp.set("page", "1");
      }
    }
    router.push(`${pathname}?${sp.toString()}`, { scroll: true });
  }

  return (
    <main className="relative min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 left-[10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 right-[10%] w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[100px] animate-pulse [animation-delay:1s]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ================= HEADER ================= */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a0e27]/80 backdrop-blur-sm border border-cyan-400/40">
              <Terminal size={14} className="text-cyan-400" />
              <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">
                PRODUCT DATABASE
              </span>
            </div>
            <div className="h-[2px] flex-1 bg-gradient-to-r from-cyan-400/40 to-transparent" />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <h1
                className="text-5xl font-black tracking-tighter text-white mb-3 uppercase"
                style={{
                  textShadow:
                    "2px 2px 0px #0066FF, -2px -2px 0px #0066FF, 2px -2px 0px #0066FF, -2px 2px 0px #0066FF",
                }}
              >
                PRODUCT CATALOG
              </h1>
              <p className="text-lg font-bold max-w-2xl text-blue-500">
                Khám phá kho công nghệ tiên tiến • Sản phẩm chất lượng cao • Giao hàng siêu tốc
              </p>
            </div>

            <div className="flex gap-10">
              {data && (
                <>
                  <div className="text-center">
                    <div
                      className="text-3xl font-black text-white uppercase"
                      style={{ textShadow: "2px 2px 0px #0066FF" }}
                    >
                      {data.total}+
                    </div>
                    <div className="text-xs font-black tracking-[0.2em] mt-1 text-blue-500 uppercase">
                      PRODUCTS
                    </div>
                  </div>

                  <div className="w-[2px] bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent" />

                  <div className="text-center">
                    <div
                      className="text-3xl font-black text-white uppercase"
                      style={{ textShadow: "2px 2px 0px #0066FF" }}
                    >
                      TRANG {pageParam}
                    </div>
                    <div className="text-xs font-black tracking-[0.2em] mt-1 text-blue-500 uppercase">
                      CURRENT PAGE
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* ================= SEARCH ================= */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-12">
          <form
            className="relative group max-w-2xl"
            onSubmit={(e) => {
              e.preventDefault();
              setUrl({ q: qInput });
            }}
          >
            <div className="relative flex items-center bg-white/5 backdrop-blur-xl border-2 border-cyan-500/40 group-hover:border-cyan-400/80 transition-all duration-300">
              <Search className="absolute left-4 w-5 h-5 text-cyan-300" />
              <input
                value={qInput}
                onChange={(e) => setQInput(e.target.value)}
                placeholder="SEARCH PRODUCTS // NHẬP TỪ KHÓA..."
                className="w-full h-14 pl-12 pr-32 bg-transparent text-black placeholder:text-gray-500 placeholder:font-bold outline-none font-bold tracking-wide"
              />
              <button
                type="submit"
                className="absolute right-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-6 py-2.5 font-black text-sm tracking-wider hover:shadow-[0_0_20px_rgba(0,247,255,0.6)]"
              >
                SEARCH
              </button>
            </div>
          </form>
        </motion.div>

        {/* ================= PRODUCT GRID ================= */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
            <span className="text-cyan-400 font-bold tracking-[0.3em]">LOADING DATA...</span>
          </div>
        ) : (
          <>
            {data && data.data.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {data.data.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm">
                <p className="text-cyan-500/50 font-bold uppercase tracking-widest">
                  Không tìm thấy sản phẩm nào
                </p>
              </div>
            )}

            {/* ================= PAGINATION ================= */}
            {data && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-20 flex justify-center items-center gap-3"
              >
                <button
                  className="group relative w-12 h-12 flex items-center justify-center border border-cyan-500/40 bg-white/5 backdrop-blur-md hover:bg-cyan-500 hover:text-black transition-all disabled:opacity-20"
                  onClick={() => setUrl({ page: pageParam - 1 })}
                  disabled={pageParam <= 1}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  {[...Array(data.totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === data.totalPages ||
                      (pageNum >= pageParam - 1 && pageNum <= pageParam + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setUrl({ page: pageNum })}
                          className={`w-12 h-12 font-black border backdrop-blur-md transition-all ${
                            pageParam === pageNum
                              ? "bg-cyan-500 border-cyan-400 text-black shadow-[0_0_15px_rgba(0,247,255,0.4)]"
                              : "border-cyan-500/20 bg-white/5 text-cyan-500 hover:border-cyan-500"
                          }`}
                        >
                          {String(pageNum).padStart(2, "0")}
                        </button>
                      );
                    }
                    if (pageNum === pageParam - 2 || pageNum === pageParam + 2) {
                      return (
                        <span key={pageNum} className="text-cyan-800 font-bold px-1">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  className="group relative w-12 h-12 flex items-center justify-center border border-cyan-500/40 bg-white/5 backdrop-blur-md hover:bg-cyan-500 hover:text-black transition-all disabled:opacity-20"
                  onClick={() => setUrl({ page: pageParam + 1 })}
                  disabled={pageParam >= data.totalPages}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>

      <SiteFooter />
    </main>
  );
}
