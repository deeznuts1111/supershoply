"use client";
import { useCart } from "@/features/cart/cart-context";
import { formatVND } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Thêm import này
import SiteFooter from "@/components/SiteFooter";

export default function CartPage() {
  const router = useRouter(); // Khởi tạo router
  const { state, dispatch, subtotal, hydrated } = useCart();
  
  if (!hydrated) return null;

  const items = state.items;
  const shipping = items.length ? 15000 : 0;
  const total = subtotal + shipping;

  // Hàm xử lý chuyển hướng kèm dữ liệu sản phẩm
  const handleGoToCheckout = () => {
    if (items.length === 0) return;
    // Tạo chuỗi: slug1:qty1,slug2:qty2
    const itemsQuery = items.map(it => `${it.slug}:${it.quantity}`).join(",");
    router.push(`/checkout?items=${itemsQuery}`);
  };

  return (
    <main className="py-8 px-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold">Giỏ hàng</h1>

      {items.length === 0 ? (
        <div className="mt-6 text-gray-600">
          Giỏ hàng của bạn đang bị trống. 
          <Link className="underline ml-1" href="/shop">Mua sắm ngay →</Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map((it) => (
              <div key={it.productId} className="flex gap-4 border rounded-xl p-3 bg-white shadow-sm">
                <Image
                  src={it.image || "/aaa.png"}
                  alt={it.title}
                  width={96}
                  height={96}
                  className="rounded-md border object-cover"
                />
                <div className="flex-1">
                  <Link href={`/shop/${it.slug}`} className="font-medium hover:underline">
                    {it.title}
                  </Link>
                  <div className="text-sm text-gray-600 mt-1">{formatVND(it.price)}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <label className="text-sm text-gray-500">SL:</label>
                    <input
                      type="number"
                      min={1}
                      value={it.quantity}
                      onChange={(e) =>
                        dispatch({ type: "SET_QTY", payload: { productId: it.productId, quantity: Number(e.target.value) || 1 } })
                      }
                      className="w-16 h-8 px-2 border rounded-md text-sm"
                    />
                    <button
                      onClick={() => dispatch({ type: "REMOVE", payload: { productId: it.productId } })}
                      className="ml-auto text-sm text-red-500 hover:bg-red-50 px-3 py-1 rounded-md border border-red-100 transition-colors"
                    >
                      Xoá
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="border rounded-xl p-4 h-fit bg-gray-50 sticky top-4">
            <h2 className="text-lg font-semibold border-b pb-2">Tóm tắt</h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Tạm tính</span><span>{formatVND(subtotal)}</span></div>
              <div className="flex justify-between text-gray-600"><span>Phí vận chuyển</span><span>{formatVND(shipping)}</span></div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 text-black">
                <span>Tổng cộng</span>
                <span>{formatVND(total)}</span>
              </div>
            </div>
            
            <button 
              onClick={handleGoToCheckout}
              className="mt-4 w-full h-11 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
            >
              Thanh toán ngay !
            </button>
            
            <button className="mt-2 w-full text-sm text-gray-400 hover:text-red-500 transition-colors" onClick={() => dispatch({ type: "CLEAR" })}>
              Xoá toàn bộ giỏ hàng
            </button>
          </aside>
        </div>
      )}
      
      <SiteFooter />
      
    </main>
  );

}
