import type { Product } from "@/types/product";
import { getDB } from "@/lib/mongodb";

/**
 * PRODUCTS vẫn tồn tại
 * nhưng là Promise<Product[]>
 */
export const PRODUCTS: Promise<Product[]> = (async () => {
  const db = await getDB();
  const collection = db.collection("products");

  const products = await collection.find({}).toArray();

  return products.map((p: any) => ({
    ...p,
    _id: p._id.toString(), // ObjectId -> string
  })) satisfies Product[];
})();
