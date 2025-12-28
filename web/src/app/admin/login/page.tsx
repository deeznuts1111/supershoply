"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValues } from "@/app/features/auth/schemas";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/services/admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), mode: "onChange" });

  async function onSubmit(values: LoginValues) {
    setServerMsg(null);
    try {
      const result = await adminLogin(values.email, values.password);
      
      if (result.ok && result.user.role === "admin") {
        // Lưu token vào localStorage
        localStorage.setItem("adminToken", result.token);
        localStorage.setItem("adminUser", JSON.stringify(result.user));
        
        // Redirect to admin dashboard
        router.push("/admin");
      } else {
        setServerMsg("Bạn không có quyền truy cập admin");
      }
    } catch (error) {
      setServerMsg(error instanceof Error ? error.message : "Đăng nhập thất bại");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-2">Admin Login</h1>
        <p className="text-center text-gray-600 mb-6">Đăng nhập vào khu vực quản trị</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-md h-11 px-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
              disabled={isSubmitting}
              placeholder="admin@example.com"
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input
              type="password"
              className="w-full border rounded-md h-11 px-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
              disabled={isSubmitting}
              placeholder="••••••••"
            />
            {errors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full h-11 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          {serverMsg && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{serverMsg}</p>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
