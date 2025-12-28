import { NextResponse } from "next/server";
import { registerSchema } from "@/app/features/auth/schemas";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://supershoply-api.onrender.com";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = registerSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Payload không hợp lệ", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Gọi đến backend API thực
    const response = await fetch(`${API_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          message: data.error?.message || "Đăng ký thất bại",
          error: data.error 
        },
        { status: response.status }
      );
    }

    // Trả về token và thông tin user
    return NextResponse.json({
      ok: true,
      token: data.token,
      user: data.user,
    });

  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi đăng ký" },
      { status: 500 }
    );
  }
}
