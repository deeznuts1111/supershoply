import { Product } from "@/types/product";
import clientPromise from "../../../api/src/db/mongoose"; // Đường dẫn tương đối từ web/src/mock đến api/src/db

export async function getProducts(limit: number = 50): Promise<Product[]> {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "supershoply");
    
    const products = await db
      .collection("products")
      .find({})
      .limit(limit)
      .toArray();
    
    return products.map(product => ({
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
    })) as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "supershoply");
    
    const product = await db.collection("products").findOne({ _id: id });
    
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
