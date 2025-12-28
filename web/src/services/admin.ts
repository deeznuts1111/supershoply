import { apiFetch } from "@/lib/api";
import type { Product } from "@/types/product";
import type { Order } from "@/types/order";

// ============ AUTH ============
export async function adminLogin(email: string, password: string) {
  return apiFetch<{ ok: boolean; token: string; user: { id: string; name: string; email: string; role: string } }>(
    "/api/v1/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }
  );
}

// ============ ORDERS ============
export async function listOrders(token: string, params?: { page?: number; limit?: number; status?: string; phone?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.status) query.set("status", params.status);
  if (params?.phone) query.set("phone", params.phone);

  return apiFetch<{ ok: boolean; data: Order[]; page: number; limit: number; total: number; hasNext: boolean }>(
    `/api/v1/orders?${query}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export async function updateOrderStatus(token: string, orderId: string, status: "pending" | "paid" | "canceled") {
  return apiFetch<{ ok: boolean; order: Order }>(
    `/api/v1/orders/${orderId}`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    }
  );
}

export async function deleteOrder(token: string, orderId: string) {
  return apiFetch<{ ok: boolean; deletedId: string }>(
    `/api/v1/orders/${orderId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

// ============ PRODUCTS ============
export async function listProducts(params?: { page?: number; limit?: number; q?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.q) query.set("q", params.q);

  return apiFetch<{ data: Product[]; page: number; limit: number; total: number; hasNext: boolean }>(
    `/api/v1/products?${query}`
  );
}

export async function createProduct(token: string, data: Partial<Product>) {
  return apiFetch<{ ok: boolean; product: Product }>(
    "/api/v1/products",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }
  );
}

export async function updateProduct(token: string, productId: string, data: Partial<Product>) {
  return apiFetch<{ ok: boolean; product: Product }>(
    `/api/v1/products/${productId}`,
    {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }
  );
}

export async function deleteProduct(token: string, productId: string) {
  return apiFetch<{ ok: boolean; deletedId: string }>(
    `/api/v1/products/${productId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}
