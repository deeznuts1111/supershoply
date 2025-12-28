"use client";

import { useCart } from "@/features/cart/cart-context";
import { formatVND } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";

export default function CartPage() {
  const router = useRouter();
  const { state, dispatch, subtotal, hydrated } = useCart();

  if (!hydrated) return null;

  const items = state.items;
  const shipping = items.length ? 15000 : 0;
  const total = subtotal + shipping;

  const handleGoToCheckout = () => {
    if (items.length === 0) return;
    const itemsQuery = items
      .map((it) => `${it.slug}:${it.quantity}`)
      .join(",");
    router.push(`/checkout?items=${itemsQuery}`);
  };

  return (
    <>
      {/* =====================================================
          CART PAGE
      ===================================================== */}
      <main className="min-h-screen bg-[#0a0e27] text-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-black text-white mb-6">
            GIỎ <span className="text-cyan-400">HÀNG</span>
          </h1>

          {items.length === 0 ? (
            <div className="mt-10 text-center border border-cyan-400/30 bg-[#0f172a] p-10 rounded-xl">
              <p className="text-gray-400 mb-4">
                Giỏ hàng của bạn đang trống
              </p>
              <Link
                href="/shop"
                className="inline-block px-6 py-2 border border-cyan-400 text-cyan-400 font-bold hover:bg-cyan-400 hover:text-black transition"
              >
                Mua sắm ngay →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* =================================================
                  ITEMS
              ================================================= */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((it) => (
                  <div
                    key={it.productId}
                    className="flex gap-4 bg-[#0f172a] border border-cyan-400/20 rounded-xl p-4
                               hover:shadow-[0_0_25px_rgba(0,247,255,0.15)] transition"
                  >
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-cyan-400/30">
                      <Image
                        src={it.image || "/aaa.png"}
                        alt={it.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <Link
                        href={`/shop/${it.slug}`}
                        className="font-semibold text-white hover:text-cyan-400 transition"
                      >
                        {it.title}
                      </Link>

                      <div className="text-sm text-cyan-400 mt-1">
                        {formatVND(it.price)}
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <label className="text-xs text-gray-400 tracking-wider">
                          SL
                        </label>

                        <input
                          type="number"
                          min={1}
                          value={it.quantity}
                          onChange={(e) =>
                            dispatch({
                              type: "SET_QTY",
                              payload: {
                                productId: it.productId,
                                quantity:
                                  Number(e.target.value) || 1,
                              },
                            })
                          }
                          className="w-16 h-8 bg-[#0a0e27] border border-cyan-400/40
                                     text-white text-sm px-2 focus:outline-none"
                        />

                        <button
                          onClick={() =>
                            dispatch({
                              type: "REMOVE",
                              payload: {
                                productId: it.productId,
                              },
                            })
                          }
                          className="ml-auto text-xs text-red-400 border border-red-400/30
                                     px-3 py-1 hover:bg-red-500 hover:text-white transition"
                        >
                          Xoá
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* =================================================
                  SUMMARY
              ================================================= */}
              <aside className="bg-[#0f172a] border border-cyan-400/30 rounded-xl p-6 h-fit sticky top-6">
                <h2 className="text-xl font-black text-white border-b border-cyan-400/30 pb-3">
                  TÓM TẮT
                </h2>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Tạm tính</span>
                    <span>{formatVND(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>Vận chuyển</span>
                    <span>{formatVND(shipping)}</span>
                  </div>

                  <div className="flex justify-between font-bold text-lg text-cyan-400 border-t border-cyan-400/30 pt-3">
                    <span>Tổng</span>
                    <span>{formatVND(total)}</span>
                  </div>
                </div>

                <button
                  onClick={handleGoToCheckout}
                  className="mt-6 w-full h-11 bg-gradient-to-r from-cyan-400 to-blue-500
                             text-black font-black tracking-wider
                             hover:shadow-[0_0_30px_rgba(0,247,255,0.6)]
                             active:scale-95 transition"
                >
                  THANH TOÁN NGAY
                </button>

                <button
                  onClick={() =>
                    dispatch({ type: "CLEAR" })
                  }
                  className="mt-3 w-full text-xs text-gray-500 hover:text-red-400 transition"
                >
                  Xoá toàn bộ giỏ hàng
                </button>
              </aside>
            </div>
          )}
        </div>
      </main>

      {/* =====================================================
          FOOTER (FULL WIDTH)
      ===================================================== */}
      <SiteFooter />
    </>
  );
}
