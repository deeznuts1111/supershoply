import type { Product } from "@/types/product";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

// Schema cho Product (nếu chưa có)
const ProductSchema = new mongoose.Schema({
  title: String,
  slug: String,
  price: Number,
  images: [String],
  stock: Number,
  rating: Number,
  brand: String,
  variants: Array,
  description: String,
  category: String,
}, { collection: 'products' });

const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export async function getProducts(limit: number = 50): Promise<Product[]> {
  try {
    await connectDB();
    
    const products = await ProductModel.find({}).limit(limit).lean();
    
    return products.map((p: any) => ({
      _id: p._id.toString(),
      title: p.title,
      slug: p.slug,
      price: p.price,
      images: p.images,
      stock: p.stock,
      rating: p.rating,
      brand: p.brand,
      variants: p.variants,
      description: p.description,
      category: p.category,
    })) as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    await connectDB();
    const product = await ProductModel.findOne({ slug }).lean();
    
    if (!product) return null;
    
    return {
      _id: product._id.toString(),
      title: product.title,
      slug: product.slug,
      price: product.price,
      images: product.images,
      stock: product.stock,
      rating: product.rating,
      brand: product.brand,
      variants: product.variants,
      description: product.description,
      category: product.category,
    } as Product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// Export mock data để không phá code cũ
export const PRODUCTS: Product[] = [];
