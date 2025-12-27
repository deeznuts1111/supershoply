"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { calcTotals } from "@/lib/checkout";
import { Suspense } from "react";

const API_URL = "https://supershoply-api.onrender.com";

type PM = "cod" | "banking" | "momo";

function formatVND(n: number) {
  return n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function CheckoutContent() {
  const sp = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Đọc items từ URL
  const itemsParam = sp.get("items") || "";
  
  // Parse slug:quantity từ URL
  const parsedItems = useMemo(() => {
    return itemsParam
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)
      .map((pair) => {
        const [slug, qty] = pair.split(":");
        return { slug, quantity: Math.max(parseInt(qty || "1", 10), 1) };
      });
  }, [itemsParam]);

  // Fetch products từ API
  useEffect(() => {
    async function fetchProducts() {
      if (!parsedItems.length) {
        setLoading(false);
        return;
      }

      try {
        const promises = parsedItems.map((item) =>
          fetch(`${API_URL}/api/products/${item.slug}`).then((r) => r.json())
        );
        const fetchedProducts = await Promise.all(promises);
        
        const enriched = parsedItems
          .map((item, idx) => {
            const product = fetchedProducts[idx];
            if (!product || product.message === "Not found") return null;
            return { ...item, product };
          })
          .filter(Boolean);

        setProducts(enriched as any);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [parsedItems]);

  const totals = useMemo(() => {
    if (!products.length) return { subtotal: 0, shippingFee: 0, total: 0 };
    return calcTotals(
      products.map((x) => ({ price: x.product.price, quantity: x.quantity })),
      ""
    );
  }, [products]);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addr, setAddr] = useState("");
  const [pm, setPM] = useState<PM>("cod");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!products.length) {
      setError("Giỏ hàng trống hoặc tham số URL không hợp lệ.");
      return;
    }
    if (!name.trim() || !addr.trim()) {
      setError("Vui lòng nhập Họ tên và Địa chỉ.");
      return;
    }

    setSubmitting(true);
    try {
      const items = products.map((x) => ({
        productId: x.product._id,
        quantity: x.quantity,
      }));

      const payload = {
        customerName: name,
        customerPhone: phone,
        customerAddress: addr,
        paymentMethod: pm,
        note,
        items,
      };

      const response = await fetch(`${API_URL}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (!response.ok || !data.ok) {
        throw new Error(data.error?.message || "Tạo đơn hàng thất bại");
      }

      setResult(data.order);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi đặt hàng.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="py-12 text-center">
        <p>Đang tải thông tin giỏ hàng...</p>
      </div>
    );
  }

  return (
    <section className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <h1 className="text-2xl font-semibold mb-4">Thanh toán</h1>

        <div className="mb-6 border rounded-xl p-4">
          <h2 className="font-medium mb-3">Tóm tắt giỏ hàng</h2>
          {products.length === 0 ? (
            <p className="text-gray-500">
              Chưa có sản phẩm. Quay lại{" "}
              <button
                type="button"
                className="underline"
                onClick={() => router.push("/shop")}
              >
                Shop
              </button>
            </p>
          ) : (
            <ul className="space-y-2">
              {products.map((x) => (
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
                  <div className="text-right">
                    {formatVND(x.product.price * x.quantity)}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 text-right text-sm text-gray-500">
            {products.length} dòng
          </div>
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
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="pm"
                  value="cod"
                  checked={pm === "cod"}
                  onChange={() => setPM("cod")}
                />
                <span>COD</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="pm"
                  value="banking"
                  checked={pm === "banking"}
                  onChange={() => setPM("banking")}
                />
                <span>Banking</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="pm"
                  value="momo"
                  checked={pm === "momo"}
                  onChange={() => setPM("momo")}
                />
                <span>MoMo</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Ghi chú</label>
            <textarea
              className="w-full border rounded-md p-2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting || products.length === 0}
              className="h-10 px-4 rounded-md border bg-black text-white disabled:opacity-50"
            >
              {submitting ? "Đang xử lý..." : "Đặt hàng"}
            </button>
            <button
              type="button"
              className="h-10 px-4 rounded-md border"
              onClick={() => router.push("/cart")}
            >
              Quay lại giỏ hàng
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-6 border rounded-xl p-4 bg-green-50">
            <h2 className="font-medium mb-2">Đặt hàng thành công</h2>
            <p className="text-sm">
              Mã đơn: <b>{result.id}</b>
            </p>
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
        <p className="text-xs text-gray-500 mt-3">
          * Phí ship thay đổi theo địa chỉ & khuyến mãi (giả lập).
        </p>
      </aside>
    </section>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center">Đang tải...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
