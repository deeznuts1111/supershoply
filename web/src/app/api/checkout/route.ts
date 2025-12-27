import { NextResponse } from "next/server";

const API_URL = "https://supershoply-api.onrender.com";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Forward request sang backend API
    const response = await fetch(`${API_URL}/api/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: { code: "INTERNAL", message: "Checkout failed" },
      },
      { status: 500 }
    );
  }
}
