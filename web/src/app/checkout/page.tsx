"use client";

import { useMemo, useState, Suspense } from "react"; // Thêm Suspense
import { useSearchParams, useRouter } from "next/navigation";
import { PRODUCTS } from "@/mock/products";
import { calcTotals } from "@/lib/checkout";
import { getProductBySlug } from "@/services/products";
import { createOrder } from "@/services/orders";

type PM = "cod" | "banking" | "momo";

function formatVND(n: number) {
  return n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

// 1. Tách toàn bộ logic cũ vào component này
function CheckoutContent() {
  const sp = useSearchParams();
  const router = useRouter();

  const itemsParam = sp.get("items") || "";
  const parsed = useMemo(() => {
    const list = itemsParam
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)
      .map((pair) => {
        const [slug, qty] = pair.split(":");
        return { slug, quantity: Math.max(parseInt(qty || "1", 10), 1) };
      });
    
    const enriched = list
      .map((it) => {
        const p = PRODUCTS.find((x) => x.slug === it.slug);
        return p ? { ...it, product: p } : null;
      })
      .filter(Boolean) as { slug: string; quantity: number; product: (typeof PRODUCTS)[number] }[];
    return enriched;
  }, [itemsParam]);

  const totals = useMemo(() => {
    return calcTotals(parsed.map((x) => ({ price: x.product.price, quantity: x.quantity })), "");
  }, [parsed]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addr, setAddr] = useState("");
  const [pm, setPM] = useState<PM>("cod");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null); // Để tạm any hoặc định nghĩa interface Order
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!parsed.length) {
      setError("Giỏ hàng trống hoặc tham số URL không hợp lệ.");
      return;
    }
    if (!name.trim() || !addr.trim()) {
      setError("Vui lòng nhập Họ tên và Địa chỉ.");
      return;
    }

    setSubmitting(true);
    try {
      const items = await Promise.all(
        parsed.map(async (x) => {
          const beProduct = await getProductBySlug(x.product.slug);
          if (!beProduct?._id) throw new Error("Không tìm thấy sản phẩm: " + x.product.slug);
          return { productId: beProduct._id, quantity: x.quantity };
        })
      );

      const payload = {
        customerName: name,
        customerPhone: phone,
        customerAddress: addr,
        paymentMethod: pm,
        note,
        items,
      };

      const response = await createOrder(payload);
      if (!response?.order) throw new Error("Tạo đơn hàng thất bại");
      setResult(response.order);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi đặt hàng.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <h1 className="text-2xl font-semibold mb-4">Thanh toán</h1>

        <div className="mb-6 border rounded-xl p-4">
          <h2 className="font-medium mb-3">Tóm tắt giỏ hàng</h2>
          {parsed.length === 0 ? (
            <p className="text-gray-500">
              Chưa có sản phẩm. Quay lại{" "}
              <button type="button" className="underline" onClick={() => router.push("/shop")}>
                Shop
              </button>
            </p>
          ) : (
            <ul className="space-y-2">
              {parsed.map((x) => (
                <li key={x.slug} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={x.product.images?.[0] || "/placeholder.png"}
                      alt={x.product.title}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <div>
                      <p className="font-medium">{x.product.title}</p>
                      <p className="text-sm text-gray-500">SL: {x.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">{formatVND(x.product.price * x.quantity)}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Họ tên *</label>
            <input
              className="w-full border rounded-md p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Số điện thoại</label>
            <input
              className="w-full border rounded-md p-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="090..."
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Địa chỉ *</label>
            <textarea
              className="w-full border rounded-md p-2"
              value={addr}
              onChange={(e) => setAddr(e.target.value)}
              placeholder="Số nhà, đường, quận/huyện, tỉnh/thành"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Phương thức thanh toán</label>
            <div className="flex gap-3">
              {(["cod", "banking", "momo"] as PM[]).map((type) => (
                <label key={type} className="flex items-center gap-2 uppercase">
                  <input type="radio" name="pm" value={type} checked={pm === type} onChange={() => setPM(type)} />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Ghi chú</label>
            <textarea className="w-full border rounded-md p-2" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting || parsed.length === 0}
              className="h-10 px-4 rounded-md border bg-black text-white"
            >
              {submitting ? "Đang xử lý..." : "Đặt hàng"}
            </button>
            <button type="button" className="h-10 px-4 rounded-md border" onClick={() => router.push("/cart")}>
              Quay lại giỏ hàng
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-6 border rounded-xl p-4 bg-green-50">
            <h2 className="font-medium mb-2">Đặt hàng thành công</h2>
            <p className="text-sm">Mã đơn: <b>{result.id}</b></p>
            <p className="text-sm">Trạng thái: {result.status}</p>
          </div>
        )}
      </div>

      <aside className="border rounded-xl p-4 h-fit">
        <h2 className="font-medium mb-3">Thanh toán</h2>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Tạm tính</span>
            <span>{formatVND(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Phí vận chuyển</span>
            <span>{formatVND(totals.shippingFee)}</span>
          </div>
        </div>
        <div className="border-t my-2" />
        <div className="flex justify-between font-semibold">
          <span>Tổng cộng</span>
          <span>{formatVND(totals.total)}</span>
        </div>
      </aside>
    </section>
  );
}

// 2. Export default bọc trong Suspense
export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Đang tải trang thanh toán...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
