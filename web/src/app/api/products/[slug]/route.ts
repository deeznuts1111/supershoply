import { NextResponse } from "next/server";

const API_URL = "https://supershoply-api.onrender.com";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const response = await fetch(`${API_URL}/api/products/${slug}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { message: "Not found" },
        { status: 404 }
      );
    }
    
    const product = await response.json();
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { message: "Internal error" },
      { status: 500 }
    );
  }
}
