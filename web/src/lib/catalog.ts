import type { Product } from "@/types/product";

const API_URL = "https://supershoply-api.onrender.com/api/v1";

// Hàm gọi API lấy sản phẩm theo slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products/${slug}`, {
      cache: 'no-store' // Hoặc dùng next: { revalidate: 60 } nếu muốn cache
    });
    
    if (!response.ok) {
      return null;
    }
    
    const product = await response.json();
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Hàm lấy tất cả sản phẩm với phân trang
export async function getProducts(params?: {
  page?: number;
  limit?: number;
  q?: string;
}) {
  try {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.q) searchParams.set('q', params.q);

    const response = await fetch(
      `${API_URL}/products?${searchParams.toString()}`,
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return { data: [], page: 1, limit: 12, total: 0, hasNext: false };
  }
}
