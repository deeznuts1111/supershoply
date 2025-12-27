import { NextResponse } from "next/server";

const API_URL = "https://supershoply-api.onrender.com/api/v1";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Forward tất cả query params sang backend API
    const response = await fetch(
      `${API_URL}/products?${searchParams.toString()}`,
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
      throw new Error('Backend API error');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in products API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
