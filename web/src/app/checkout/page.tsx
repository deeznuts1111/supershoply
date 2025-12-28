"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { calcTotals } from "@/lib/checkout";
import { Suspense } from "react";
import { ShoppingCart, Package, CreditCard, MapPin, Phone, User, FileText, ArrowLeft, CheckCircle, Terminal, Zap } from "lucide-react";

const API_URL = "https://supershoply-api.onrender.com/api/v1";

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
          fetch(`${API_URL}/products/${item.slug}`).then((r) => r.json())
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

      const response = await fetch(`${API_URL}/orders`, {
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0e27] to-[#0f172a]">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-none bg-[#0a0e27] border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,247,255,0.4)]">
            <Terminal size={20} className="text-cyan-400 animate-pulse" />
            <p className="text-cyan-400 font-black tracking-wider">LOADING CART DATA...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f172a] to-[#1e293b] py-12">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-none bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 flex items-center justify-center">
              <ShoppingCart className="text-cyan-400" size={24} />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">CHECKOUT SYSTEM</h1>
          </div>
          <div className="h-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 to-transparent" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Summary */}
            <div className="relative rounded-none border-2 border-cyan-400/40 bg-gradient-to-br from-[#0a0e27] to-[#0f172a] p-6 overflow-hidden group hover:border-cyan-400 transition-all">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Package className="text-cyan-400" size={20} />
                  <h2 className="text-xl font-black text-white tracking-tight">ORDER ITEMS</h2>
                </div>

                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 mb-4">Không có sản phẩm trong giỏ hàng</p>
                    <button
                      onClick={() => router.push("/shop")}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-black hover:shadow-[0_0_20px_rgba(0,247,255,0.6)] transition-all"
                    >
                      <ShoppingCart size={18} />
                      VÀO SHOP
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map((x) => (
                      <div key={x.slug} className="flex items-center gap-4 p-4 rounded-none border border-cyan-400/20 bg-[#0a0e27]/50 hover:border-cyan-400/40 transition-all">
                        <img
                          src={x.product.images?.[0] || "/placeholder.png"}
                          alt={x.product.title}
                          className="w-20 h-20 object-cover border border-cyan-400/30"
                        />
                        <div className="flex-1">
                          <p className="font-bold text-white">{x.product.title}</p>
                          <p className="text-sm text-cyan-400">Quantity: {x.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-black text-cyan-400">{formatVND(x.product.price * x.quantity)}</p>
                        </div>
                      </div>
                    ))}
                    <div className="text-right text-sm text-gray-400 pt-2 border-t border-cyan-400/20">
                      {products.length} sản phẩm
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form */}
            {!result && (
              <form onSubmit={onSubmit} className="relative rounded-none border-2 border-cyan-400/40 bg-gradient-to-br from-[#0a0e27] to-[#0f172a] p-6 overflow-hidden group hover:border-cyan-400 transition-all">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10 space-y-5">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="text-cyan-400" size={20} />
                    <h2 className="text-xl font-black text-white tracking-tight">CUSTOMER INFO</h2>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-cyan-400 font-bold mb-2">
                      <User size={16} /> HỌ TÊN *
                    </label>
                    <input
                      className="w-full bg-[#0a0e27] border border-cyan-400/40 text-white px-4 py-3 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_10px_rgba(0,247,255,0.3)] transition-all"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nhập họ tên..."
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-cyan-400 font-bold mb-2">
                      <Phone size={16} /> SỐ ĐIỆN THOẠI
                    </label>
                    <input
                      className="w-full bg-[#0a0e27] border border-cyan-400/40 text-white px-4 py-3 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_10px_rgba(0,247,255,0.3)] transition-all"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="090..."
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-cyan-400 font-bold mb-2">
                      <MapPin size={16} /> ĐỊA CHỈ *
                    </label>
                    <textarea
                      className="w-full bg-[#0a0e27] border border-cyan-400/40 text-white px-4 py-3 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_10px_rgba(0,247,255,0.3)] transition-all min-h-[100px]"
                      value={addr}
                      onChange={(e) => setAddr(e.target.value)}
                      placeholder="Số nhà, đường, quận/huyện, tỉnh/thành..."
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-cyan-400 font-bold mb-3">
                      <CreditCard size={16} /> PHƯƠNG THỨC THANH TOÁN
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: "cod", label: "COD" },
                        { value: "banking", label: "BANKING" },
                        { value: "momo", label: "MOMO" }
                      ].map((method) => (
                        <label key={method.value} className="relative cursor-pointer">
                          <input
                            type="radio"
                            name="pm"
                            value={method.value}
                            checked={pm === method.value}
                            onChange={() => setPM(method.value as PM)}
                            className="peer sr-only"
                          />
                          <div className="px-4 py-3 text-center border border-cyan-400/40 bg-[#0a0e27]/50 text-gray-400 font-bold peer-checked:border-cyan-400 peer-checked:bg-cyan-500/20 peer-checked:text-cyan-400 peer-checked:shadow-[0_0_15px_rgba(0,247,255,0.3)] transition-all">
                            {method.label}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm text-cyan-400 font-bold mb-2">
                      <FileText size={16} /> GHI CHÚ
                    </label>
                    <textarea
                      className="w-full bg-[#0a0e27] border border-cyan-400/40 text-white px-4 py-3 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_10px_rgba(0,247,255,0.3)] transition-all min-h-[80px]"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ghi chú đơn hàng (tùy chọn)..."
                    />
                  </div>

                  {error && (
                    <div className="p-4 border-2 border-red-500/50 bg-red-500/10 text-red-400 font-bold">
                      <div className="flex items-center gap-2">
                        <Zap size={16} />
                        {error}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={submitting || products.length === 0}
                      className="flex-1 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-black text-lg hover:shadow-[0_0_30px_rgba(0,247,255,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {submitting ? "PROCESSING..." : "ĐẶT HÀNG NGAY"}
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push("/cart")}
                      className="px-6 py-4 border-2 border-cyan-400 text-cyan-400 font-black hover:bg-cyan-500/20 transition-all"
                    >
                      <ArrowLeft size={20} />
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Success Message */}
            {result && (
              <div className="relative rounded-none border-2 border-green-400 bg-gradient-to-br from-green-900/20 to-emerald-900/20 p-6 overflow-hidden">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-green-400" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-green-400" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="text-green-400" size={32} />
                    <h2 className="text-2xl font-black text-green-400">ORDER SUCCESS</h2>
                  </div>
                  <div className="space-y-2 text-white">
                    <p className="flex items-center gap-2">
                      <span className="text-gray-400">Order ID:</span>
                      <span className="font-black text-cyan-400">{result._id}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gray-400">Status:</span>
                      <span className="font-black text-green-400 uppercase">{result.status}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-gray-400">Total:</span>
                      <span className="font-black text-cyan-400">{formatVND(result.total)}</span>
                    </p>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => router.push("/shop")}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-black hover:shadow-[0_0_20px_rgba(0,247,255,0.6)] transition-all"
                    >
                      TIẾP TỤC MUA SẮM
                    </button>
                    <button
                      onClick={() => router.push("/")}
                      className="px-6 py-3 border-2 border-cyan-400 text-cyan-400 font-black hover:bg-cyan-500/20 transition-all"
                    >
                      VỀ TRANG CHỦ
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Order Summary */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="relative rounded-none border-2 border-cyan-400/40 bg-gradient-to-br from-[#0a0e27] to-[#0f172a] p-6 overflow-hidden group hover:border-cyan-400 transition-all">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <Terminal className="text-cyan-400" size={20} />
                  <h2 className="text-xl font-black text-white tracking-tight">ORDER SUMMARY</h2>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal:</span>
                    <span className="font-bold text-white">{formatVND(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping Fee:</span>
                    <span className="font-bold text-white">{formatVND(totals.shippingFee)}</span>
                  </div>
                  
                  <div className="h-[2px] bg-gradient-to-r from-cyan-400/50 to-transparent my-4" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-black text-white">TOTAL:</span>
                    <span className="text-2xl font-black text-cyan-400">{formatVND(totals.total)}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 border border-cyan-400/20 bg-[#0a0e27]/50">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    * Phí ship thay đổi theo địa chỉ & khuyến mãi. Đây là giá tạm tính cho mục đích demo.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0e27] to-[#0f172a]">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-none bg-[#0a0e27] border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,247,255,0.4)]">
          <Terminal size={20} className="text-cyan-400 animate-pulse" />
          <p className="text-cyan-400 font-black tracking-wider">INITIALIZING...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
