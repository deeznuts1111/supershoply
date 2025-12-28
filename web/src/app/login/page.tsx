"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValues } from "@/app/features/auth/schemas";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), mode: "onChange" });

  async function onSubmit(values: LoginValues) {
    setServerMsg(null);
    setIsSuccess(false);
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setServerMsg(data?.message ?? "Đăng nhập thất bại");
        return;
      }
      
      // Lưu token vào localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      
      // Lưu thông tin user nếu cần
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      
      setIsSuccess(true);
      setServerMsg("Đăng nhập thành công! Đang chuyển hướng...");
      
      // Redirect sau 1s
      setTimeout(() => {
        router.push("/shop");
      }, 1000);
      
    } catch (error) {
      setServerMsg("Có lỗi xảy ra khi đăng nhập");
    }
  }

  return (
    <main className="py-10 max-w-md mx-auto px-4">
      <h1 className="text-2xl font-semibold">Đăng nhập</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            className="mt-1 w-full border rounded-md h-10 px-3"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
            disabled={isSubmitting}
            placeholder="ban@example.com"
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Mật khẩu</label>
          <input
            type="password"
            className="mt-1 w-full border rounded-md h-10 px-3"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
            disabled={isSubmitting}
            placeholder="••••••"
          />
          {errors.password && (
            <p id="password-error" className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="h-10 px-4 rounded-md border bg-black text-white disabled:opacity-50 w-full"
        >
          {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        {serverMsg && (
          <p className={`text-sm mt-2 ${isSuccess ? "text-green-600" : "text-red-600"}`}>
            {serverMsg}
          </p>
        )}

        <div className="text-center text-sm text-gray-600 mt-4">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </form>
    </main>
  );
}
