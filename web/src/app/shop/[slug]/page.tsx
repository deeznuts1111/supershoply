import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatVND } from "@/lib/format";
import type { Product } from "@/types/product";
import SiteFooter from "@/components/SiteFooter";
import { getProductBySlug } from "@/lib/catalog";
import AddToCartButton from "@/features/cart/AddToCartButton";

const API_URL = "https://supershoply-api.onrender.com/api/v1";

/* =========================================================
   SEO METADATA
========================================================= */
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const slug = (await params).slug;
  const product = await getProductBySlug(slug);

  return {
    title: product ? `${product.title} – Shoply` : "Sản phẩm – Shoply",
  };
}

/* =========================================================
   RELATED PRODUCTS (KEEP LOGIC)
========================================================= */
async function getRandomProducts(
  currentSlug: string,
  count: number
): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products?limit=100`, {
      cache: "no-store",
    });

    if (!response.ok) return [];

    const { data } = await response.json();

    const filtered = data.filter(
      (p: Product) => p.slug !== currentSlug && (p.stock ?? 0) > 0
    );

    const shuffled = filtered.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

/* =========================================================
   PAGE
========================================================= */
export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = (await params).slug;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const imageSrc: string =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : "/ham.png";

  const currentStock = product.stock ?? 0;
  const isDeal = (product.price ?? 0) < 150000;
  const outOfStock = currentStock <= 0;

  const relatedProducts = await getRandomProducts(slug, 4);

  return (
    <main className="bg-[#0a0e27] text-gray-200 py-12">
      {/* =====================================================
          PRODUCT DETAIL
      ===================================================== */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* IMAGE */}
        <div className="relative">
          <div className="relative aspect-square border border-cyan-400/30 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,247,255,0.1)]">
            <Image
              src={imageSrc}
              alt={product.title}
              fill
              className="object-cover"
            />

            {outOfStock && (
              <span className="absolute left-3 top-3 text-xs bg-red-500 text-white px-2 py-1 rounded-md">
                Hết hàng
              </span>
            )}

            {isDeal && (
              <span className="absolute right-3 top-3 text-xs bg-cyan-500 text-black px-2 py-1 rounded-md font-bold">
                DEAL
              </span>
            )}
          </div>
        </div>

        {/* INFO */}
        <div>
          <h2 className="text-3xl font-black text-white mb-2">
            {product.title}
          </h2>

          <p className="text-cyan-400 text-sm mb-1">
            Mã: {product.slug}
          </p>
          <p className="text-gray-400 text-sm">
            Hãng: {product.brand}
          </p>
          <p className="text-gray-400 text-sm">
            Đánh giá: {product.rating}
          </p>

          <p className="mt-6 text-3xl font-bold text-cyan-400">
            {formatVND(product.price)}
          </p>

          {outOfStock ? (
            <p className="mt-2 text-red-400 font-semibold">
              Hết hàng
            </p>
          ) : (
            <p className="mt-2 text-green-400 font-semibold">
              Còn {currentStock} sản phẩm
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <AddToCartButton
              product={product}
              disabled={outOfStock}
              fullWidth={false}
            />

            <button
              disabled={outOfStock}
              className="h-10 px-5 border border-cyan-400/40 bg-cyan-500 text-black font-bold hover:shadow-[0_0_20px_rgba(0,247,255,0.5)] disabled:opacity-40"
            >
              Mua ngay
            </button>

            <Link
              href="/shop"
              className="h-10 px-5 border border-gray-500 flex items-center text-gray-300 hover:text-cyan-300"
            >
              ← Quay lại Shop
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================
          RELATED PRODUCTS
      ===================================================== */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-20">
          <h3 className="text-2xl font-black text-white mb-8">
            CÓ THỂ BẠN{" "}
            <span className="text-cyan-400">QUAN TÂM</span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => {
              const relatedImageSrc: string =
                Array.isArray(p.images) && p.images.length > 0
                  ? p.images[0]
                  : "/ham.png";

              const relatedIsDeal =
                (p.price ?? 0) < 150000;
              const relatedOutOfStock =
                (p.stock ?? 0) <= 0;

              return (
                <Link
                  key={p.slug}
                  href={`/shop/${p.slug}`}
                >
                  <div className="bg-[#0f172a] border border-cyan-400/20 rounded-xl overflow-hidden hover:shadow-[0_0_25px_rgba(0,247,255,0.15)] transition">
                    {/* IMAGE FIXED SIZE */}
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={relatedImageSrc}
                        alt={p.title}
                        fill
                        className="object-cover"
                      />

                      {relatedOutOfStock && (
                        <span className="absolute left-2 top-2 text-xs bg-red-500 text-white px-2 py-1 rounded-md">
                          Hết hàng
                        </span>
                      )}

                      {relatedIsDeal && (
                        <span className="absolute right-2 top-2 text-xs bg-cyan-500 text-black px-2 py-1 rounded-md font-bold">
                          DEAL
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <h4 className="font-semibold text-white truncate">
                        {p.title}
                      </h4>

                      <p className="text-sm text-gray-400 mt-1">
                        Hãng: {p.brand}
                      </p>

                      <p className="mt-2 text-sm">
                        Kho:{" "}
                        <span
                          className={
                            relatedOutOfStock
                              ? "text-red-400 font-semibold"
                              : "text-green-400 font-semibold"
                          }
                        >
                          {relatedOutOfStock
                            ? "Hết hàng"
                            : `${p.stock} sản phẩm`}
                        </span>
                      </p>

                      <p className="mt-2 text-sm text-gray-400">
                        Đánh giá: {p.rating}
                      </p>

                      <p className="mt-3 font-bold text-cyan-400">
                        {formatVND(p.price)}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <SiteFooter />
    </main>
  );
}
