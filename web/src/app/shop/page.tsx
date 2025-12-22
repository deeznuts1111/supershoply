"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, ShoppingBag } from "lucide-react"; // Cần cài lucide-react

const LIMIT = 12;

export default function ShopPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  const qParam = searchParams.get("q") || "";

  const [qInput, setQInput] = useState(qParam);
  useEffect(() => setQInput(qParam), [qParam]);

  const queryArgs = useMemo(() => ({ page: pageParam, limit: LIMIT, q: qParam || undefined }), [pageParam, qParam]);
  const { data, isLoading, isError, error } = useProductsQuery(queryArgs);

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
    router.push(`${pathname}?${sp.toString()}`, { scroll: false });
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50/50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Cửa hàng</h1>
          <p className="mt-2 text-gray-500 text-lg">Khám phá bộ sưu tập sản phẩm mới nhất của chúng tôi.</p>
        </div>

        {/* Search Bar Refined */}
        <form
          className="relative group w-full md:w-96"
          onSubmit={(e) => {
            e.preventDefault();
            setUrl({ q: qInput });
          }}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            value={qInput}
            onChange={(e) => setQInput(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full h-12 pl-10 pr-4 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 bg-white shadow-sm transition-all outline-none text-sm"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-1.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
            Tìm
          </button>
        </form>
      </div>

      <hr className="border-gray-200 mb-10" />

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-3xl" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center">
          <p className="text-red-600 font-medium">Lỗi tải dữ liệu: {(error as Error)?.message}</p>
        </div>
      )}

      {/* Empty State */}
      {data && data.data.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900">Không tìm thấy sản phẩm</h3>
          <p className="text-gray-500 mt-2">Hãy thử thay đổi từ khóa tìm kiếm của bạn.</p>
        </div>
      )}

      {/* Product Grid */}
      {data && data.data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {data.data.map((p) => (
            <div key={p._id} className="group transition-transform duration-300 hover:-translate-y-2">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination Refined */}
      {data && (
        <div className="mt-16 flex justify-center items-center gap-2">
          <button
            className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 transition-all shadow-sm"
            onClick={() => setUrl({ page: Math.max(pageParam - 1, 1) })}
            disabled={pageParam <= 1}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center px-6 h-12 bg-white rounded-full border border-gray-200 shadow-sm">
            <span className="text-sm font-semibold text-gray-900">
              Trang <span className="text-blue-600">{data.page}</span>
            </span>
          </div>

          <button
            className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-30 transition-all shadow-sm"
            onClick={() => setUrl({ page: data.page + 1 })}
            disabled={!data.hasNext}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </main>
  );
}