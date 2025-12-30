"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  listOrders,
  updateOrderStatus,
  deleteOrder,
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/admin";
import type { Order } from "@/types/order";
import type { Product } from "@/types/product";

type Tab = "orders" | "products";

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("orders");
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    const storedUser = localStorage.getItem("adminUser");

    if (!storedToken || !storedUser) {
      router.push("/admin/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "admin") {
      router.push("/admin/login");
      return;
    }

    setToken(storedToken);
    setUser(parsedUser);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    router.push("/admin/login");
  };

  if (!token || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e27] text-cyan-300">
        Đang tải hệ thống...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0e27] text-gray-200">
      {/* HEADER */}
      <header className="border-b border-cyan-400/20 bg-[#0f172a] shadow-[0_0_30px_rgba(0,247,255,0.1)]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black tracking-wide text-white">
              ADMIN <span className="text-cyan-400">DASHBOARD</span>
            </h1>
            <p className="text-sm text-cyan-300/70">
              Xin chào, {user.name}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-red-400/40 text-red-400 hover:bg-red-500/10 transition font-bold"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      {/* TABS */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8 border-b border-cyan-400/20 mb-8">
          {[
            { key: "orders", label: "QUẢN LÝ ĐƠN HÀNG" },
            { key: "products", label: "QUẢN LÝ SẢN PHẨM" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as Tab)}
              className={`pb-4 font-bold tracking-wider transition border-b-2 ${
                tab === t.key
                  ? "border-cyan-400 text-cyan-400"
                  : "border-transparent text-gray-500 hover:text-cyan-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "orders" && <OrdersManager token={token} />}
        {tab === "products" && <ProductsManager token={token} />}
      </div>
    </main>
  );
}

/* ================= ORDERS ================= */

function OrdersManager({ token }: { token: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    try {
      const result = await listOrders(token, {
        page,
        limit: 10,
        status: filterStatus || undefined,
      });
      setOrders(result.data);
      setTotal(result.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page, filterStatus]);

  if (loading) {
    return <p className="text-cyan-300">Đang tải đơn hàng...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">
          Đơn hàng <span className="text-cyan-400">({total})</span>
        </h2>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          className="bg-[#0a0e27] border border-cyan-400/30 text-cyan-300 px-3 py-2"
        >
          <option value="">Tất cả</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <div className="overflow-hidden border border-cyan-400/20 bg-[#0f172a] shadow-[0_0_25px_rgba(0,247,255,0.08)]">
        <table className="w-full text-sm">
          <thead className="bg-cyan-500/10 text-cyan-300">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Khách</th>
              <th className="px-4 py-3">Tổng</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Ngày</th>
              <th className="px-4 py-3">Xóa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-400/10">
            <tr className="bg-cyan-500/20 font-bold text-cyan-300">
              <td className="px-4 py-3" colSpan={2}>
                TỔNG DOANH THU
              </td>
              <td className="px-4 py-3 text-center text-lg">
                {orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}đ
              </td>
              <td className="px-4 py-3" colSpan={3}></td>
            </tr>
            {orders.map((o) => (
              <tr key={o._id} className="hover:bg-cyan-500/5">
                <td className="px-4 py-3 font-mono text-cyan-400">
                  {o._id.slice(-6)}
                </td>
                <td className="px-4 py-3">
                  <div>{o.customerName}</div>
                  <div className="text-xs text-gray-500">
                    {o.customerPhone}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  {o.total.toLocaleString()}đ
                </td>
                <td className="px-4 py-3 text-center">
                  <select
                    value={o.status}
                    onChange={(e) =>
                      updateOrderStatus(
                        token,
                        o._id,
                        e.target.value as any
                      ).then(loadOrders)
                    }
                    className="bg-[#0a0e27] border border-cyan-400/30 text-cyan-300 px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-center text-gray-400">
                  {new Date(o.createdAt!).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() =>
                      confirm("Xóa đơn hàng?") &&
                      deleteOrder(token, o._id).then(loadOrders)
                    }
                    className="text-red-400 hover:text-red-300 font-bold"
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= PRODUCTS ================= */

function ProductsManager({ token }: { token: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    const result = await listProducts({
      page,
      limit: 10,
      q: searchQuery || undefined,
    });
    setProducts(result.data);
    setTotal(result.total);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, [page, searchQuery]);

  if (loading) {
    return <p className="text-cyan-300">Đang tải sản phẩm...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">
          Sản phẩm <span className="text-cyan-400">({total})</span>
        </h2>
        <div className="flex gap-2">
          <input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search..."
            className="bg-[#0a0e27] border border-cyan-400/30 text-cyan-300 px-3 py-2"
          />
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-cyan-500 text-black font-bold hover:shadow-[0_0_20px_rgba(0,247,255,0.6)]"
          >
            + Thêm
          </button>
        </div>
      </div>

      <div className="border border-cyan-400/20 bg-[#0f172a] shadow-[0_0_25px_rgba(0,247,255,0.08)]">
        <table className="w-full text-sm">
          <thead className="bg-cyan-500/10 text-cyan-300">
            <tr>
              <th className="px-4 py-3">Ảnh</th>
              <th className="px-4 py-3 text-left">Tên</th>
              <th className="px-4 py-3">Giá</th>
              <th className="px-4 py-3">Kho</th>
              <th className="px-4 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-400/10">
            {products.map((p) => (
              <tr key={p._id} className="hover:bg-cyan-500/5">
                <td className="px-4 py-3">
                  {p.images?.[0] && (
                    <img
                      src={p.images[0]}
                      className="w-12 h-12 object-cover border border-cyan-400/30"
                    />
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="font-bold">{p.title}</div>
                  <div className="text-xs text-gray-500">{p.slug}</div>
                </td>
                <td className="px-4 py-3 text-center">
                  {p.price.toLocaleString()}đ
                </td>
                <td className="px-4 py-3 text-center">{p.stock}</td>
                <td className="px-4 py-3 text-center space-x-3">
                  <button
                    onClick={() => {
                      setEditingProduct(p);
                      setShowForm(true);
                    }}
                    className="text-cyan-400 font-bold"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() =>
                      confirm("Xóa sản phẩm?") &&
                      deleteProduct(token, p._id).then(loadProducts)
                    }
                    className="text-red-400 font-bold"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ProductForm
          token={token}
          product={editingProduct}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            loadProducts();
          }}
        />
      )}
    </div>
  );
}

/* ================= PRODUCT FORM ================= */

function ProductForm({
  token,
  product,
  onClose,
  onSuccess,
}: {
  token: string;
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    title: product?.title || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    brand: product?.brand || "",
    category: product?.category || "",
    description: product?.description || "",
    images: product?.images?.join(", ") || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      images: formData.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    product
      ? await updateProduct(token, product._id, payload)
      : await createProduct(token, payload);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#0f172a] border border-cyan-400/30 p-6 w-full max-w-2xl text-gray-200">
        <h3 className="text-xl font-black text-cyan-400 mb-4">
          {product ? "PRODUCT EDIT" : "ADD PRODUCT}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.entries(formData).map(([key, val]) => (
            <input
              key={key}
              value={val as any}
              onChange={(e) =>
                setFormData({ ...formData, [key]: e.target.value })
              }
              placeholder={key}
              className="w-full bg-[#0a0e27] border border-cyan-400/30 px-3 py-2 text-cyan-200"
            />
          ))}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-500 text-black font-bold"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

