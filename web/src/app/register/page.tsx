"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterValues } from "@/app/features/auth/schemas";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema), mode: "onChange" });

  async function onSubmit(values: RegisterValues) {
    setServerMsg(null);
    setIsSuccess(false);
    
    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setServerMsg(data?.message ?? "Đăng ký thất bại");
        return;
      }
      
      // Lưu token vào localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      
      setIsSuccess(true);
      setServerMsg("Đăng ký thành công! Đang chuyển hướng...");
      
      // Redirect sau 1.5s
      setTimeout(() => {
        router.push("/shop");
      }, 1500);
      
    } catch (error) {
      setServerMsg("Có lỗi xảy ra khi đăng ký");
    }
  }

  const pwd = watch("password");

  return (
    <main className="py-10 max-w-md mx-auto px-4">
      <h1 className="text-2xl font-semibold">Đăng ký</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Họ tên</label>
          <input
            className="mt-1 w-full border rounded-md h-10 px-3"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
            disabled={isSubmitting}
            placeholder="Nguyễn Văn A"
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

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

        <div>
          <label className="block text-sm font-medium">Nhập lại mật khẩu</label>
          <input
            type="password"
            className="mt-1 w-full border rounded-md h-10 px-3"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
            {...register("confirmPassword")}
            disabled={isSubmitting}
            placeholder="••••••"
          />
          {errors.confirmPassword && (
            <p id="confirm-error" className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
          {pwd && !errors.confirmPassword && (
            <p className="mt-1 text-xs text-gray-500">Mẹo: dùng mật khẩu ≥ 6 ký tự</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="h-10 px-4 rounded-md border bg-black text-white disabled:opacity-50 w-full"
        >
          {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
        </button>

        {serverMsg && (
          <p className={`text-sm mt-2 ${isSuccess ? "text-green-600" : "text-red-600"}`}>
            {serverMsg}
          </p>
        )}
      </form>
    </main>
  );
}
