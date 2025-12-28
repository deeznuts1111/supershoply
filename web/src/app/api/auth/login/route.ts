import { NextResponse } from "next/server";
import { loginSchema } from "@/app/features/auth/schemas";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Payload không hợp lệ", errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Gọi đến backend API thực
    console.log("🚀 Calling backend login API...");
    const response = await fetch("https://supershoply-api.onrender.com/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: parsed.data.email,
        password: parsed.data.password,
      }),
    });

    console.log("📥 Backend response status:", response.status);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          message: data.error?.message || "Đăng nhập thất bại",
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
    console.error("❌ Login error:", error);
    return NextResponse.json(
      { message: "Có lỗi xảy ra khi đăng nhập" },
      { status: 500 }
    );
  }
}
