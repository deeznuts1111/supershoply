"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { listOrders, updateOrderStatus, deleteOrder, listProducts, createProduct, updateProduct, deleteProduct } from "@/services/admin";
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
      <div className="min-h-screen flex items-center justify-center">
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Xin chào, {user.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-4 border-b mb-6">
          <button
            onClick={() => setTab("orders")}
            className={`pb-3 px-1 font-medium border-b-2 transition ${
              tab === "orders" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Quản lý đơn hàng
          </button>
          <button
            onClick={() => setTab("products")}
            className={`pb-3 px-1 font-medium border-b-2 transition ${
              tab === "products" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Quản lý sản phẩm
          </button>
        </div>

        {/* Content */}
        {tab === "orders" && <OrdersManager token={token} />}
        {tab === "products" && <ProductsManager token={token} />}
      </div>
    </main>
  );
}

// ============ ORDERS MANAGER ============
function OrdersManager({ token }: { token: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    try {
      const result = await listOrders(token, { page, limit: 10, status: filterStatus || undefined });
      setOrders(result.data);
      setTotal(result.total);
    } catch (error) {
      alert("Lỗi tải đơn hàng: " + (error instanceof Error ? error.message : "Unknown"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page, filterStatus]);

  const handleStatusChange = async (orderId: string, newStatus: "pending" | "paid" | "canceled") => {
    try {
      await updateOrderStatus(token, orderId, newStatus);
      loadOrders();
    } catch (error) {
      alert("Lỗi cập nhật: " + (error instanceof Error ? error.message : "Unknown"));
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm("Xác nhận xóa đơn hàng này?")) return;
    try {
      await deleteOrder(token, orderId);
      loadOrders();
    } catch (error) {
      alert("Lỗi xóa: " + (error instanceof Error ? error.message : "Unknown"));
    }
  };

  if (loading) return <p>Đang tải đơn hàng...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Danh sách đơn hàng ({total})</h2>
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          className="border rounded-md px-3 py-2"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Khách hàng</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Tổng tiền</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Trạng thái</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Ngày tạo</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-mono">{order._id.slice(-6)}</td>
                <td className="px-4 py-3 text-sm">
                  <div>{order.customerName}</div>
                  <div className="text-gray-500 text-xs">{order.customerPhone}</div>
                </td>
                <td className="px-4 py-3 text-sm font-medium">{order.total.toLocaleString()}đ</td>
                <td className="px-4 py-3 text-sm">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value as any)}
                    className="border rounded px-2 py-1 text-xs"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString("vi-VN") : "-"}
                </td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          Trang trước
        </button>
        <span className="text-sm">Trang {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={orders.length < 10}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}

// ============ PRODUCTS MANAGER ============
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
    try {
      const result = await listProducts({ page, limit: 10, q: searchQuery || undefined });
      setProducts(result.data);
      setTotal(result.total);
    } catch (error) {
      alert("Lỗi tải sản phẩm: " + (error instanceof Error ? error.message : "Unknown"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page, searchQuery]);

  const handleDelete = async (productId: string) => {
    if (!confirm("Xác nhận xóa sản phẩm này?")) return;
    try {
      await deleteProduct(token, productId);
      loadProducts();
    } catch (error) {
      alert("Lỗi xóa: " + (error instanceof Error ? error.message : "Unknown"));
    }
  };

  if (loading) return <p>Đang tải sản phẩm...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Danh sách sản phẩm ({total})</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="border rounded-md px-3 py-2"
          />
          <button
            onClick={() => { setEditingProduct(null); setShowForm(true); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {showForm && (
        <ProductForm
          token={token}
          product={editingProduct}
          onClose={() => { setShowForm(false); setEditingProduct(null); }}
          onSuccess={() => { setShowForm(false); setEditingProduct(null); loadProducts(); }}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Hình ảnh</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Tên</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Giá</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Tồn kho</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  {product.images?.[0] && (
                    <img src={product.images[0]} alt={product.title} className="w-12 h-12 object-cover rounded" />
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium">{product.title}</div>
                  <div className="text-gray-500 text-xs">{product.slug}</div>
                </td>
                <td className="px-4 py-3 text-sm font-medium">{product.price.toLocaleString()}đ</td>
                <td className="px-4 py-3 text-sm">{product.stock}</td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => { setEditingProduct(product); setShowForm(true); }}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          Trang trước
        </button>
        <span className="text-sm">Trang {page}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={products.length < 10}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}

// ============ PRODUCT FORM ============
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
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: formData.title,
      price: Number(formData.price),
      stock: Number(formData.stock),
      brand: formData.brand,
      category: formData.category,
      description: formData.description,
      images: formData.images.split(",").map(s => s.trim()).filter(Boolean),
    };

    try {
      if (product) {
        await updateProduct(token, product._id, payload);
      } else {
        await createProduct(token, payload);
      }
      onSuccess();
    } catch (error) {
      alert("Lỗi: " + (error instanceof Error ? error.message : "Unknown"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">{product ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên sản phẩm *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Giá *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tồn kho *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Thương hiệu</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Danh mục</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hình ảnh (URL, phân cách bởi dấu phẩy)</label>
            <textarea
              rows={2}
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
              placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
