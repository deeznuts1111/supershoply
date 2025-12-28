"use client";

import SiteFooter from "@/components/SiteFooter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterValues,
} from "@/app/features/auth/schemas";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Terminal, UserPlus, Binary } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  async function onSubmit(values: RegisterValues) {
    setServerMsg(null);
    setIsSuccess(false);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerMsg(data?.message ?? "Đăng ký thất bại");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setIsSuccess(true);
      setServerMsg("Đăng ký thành công! Đang chuyển hướng...");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch {
      setServerMsg("Có lỗi xảy ra khi đăng ký");
    }
  }

  const pwd = watch("password");

  return (
    <>
      {/* ===================== REGISTER PAGE ===================== */}
      <main className="min-h-screen flex items-center justify-center bg-[#0a0e27] relative overflow-hidden">
        {/* BACKGROUND EFFECT */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,247,255,0.12)_0%,transparent_70%)]" />
        </div>

        <div className="w-full max-w-md relative">
          {/* CORNER DECOR */}
          <div className="absolute -top-4 -left-4 w-14 h-14 border-t-2 border-l-2 border-cyan-400/50" />
          <div className="absolute -bottom-4 -right-4 w-14 h-14 border-b-2 border-r-2 border-cyan-400/50" />

          <div className="relative bg-gradient-to-br from-[#0f172a] to-[#1e293b] border-2 border-cyan-400/40 p-8 shadow-[0_0_45px_rgba(0,247,255,0.2)]">
            {/* HEADER */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0a0e27] border border-cyan-400 mb-5 shadow-[0_0_15px_rgba(0,247,255,0.35)]">
                <Terminal size={16} className="text-cyan-400" />
                <span className="text-sm font-bold tracking-wider text-white">
                  CREATE ACCOUNT
                </span>
              </div>

              <h1 className="text-3xl font-black text-white">
                USER <span className="text-cyan-400">REGISTER</span>
              </h1>

              <div className="flex items-center justify-center gap-2 mt-3">
                <Binary size={14} className="text-cyan-400/60" />
                <p className="text-xs tracking-[0.25em] font-bold text-cyan-300/80">
                  SECURE SIGN UP
                </p>
                <Binary size={14} className="text-cyan-400/60" />
              </div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* NAME */}
              <div>
                <label className="block text-sm font-bold text-cyan-300 mb-2 tracking-wider">
                  FULL NAME
                </label>
                <input
                  className="w-full bg-[#0a0e27] border-2 border-cyan-400/40 text-white h-11 px-4 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,247,255,0.3)] placeholder:text-gray-600"
                  {...register("name")}
                  disabled={isSubmitting}
                  placeholder="Nguyễn Văn A"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-400 font-bold">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-bold text-cyan-300 mb-2 tracking-wider">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  className="w-full bg-[#0a0e27] border-2 border-cyan-400/40 text-white h-11 px-4 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,247,255,0.3)] placeholder:text-gray-600"
                  {...register("email")}
                  disabled={isSubmitting}
                  placeholder="ban@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400 font-bold">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-bold text-cyan-300 mb-2 tracking-wider">
                  PASSWORD
                </label>
                <input
                  type="password"
                  className="w-full bg-[#0a0e27] border-2 border-cyan-400/40 text-white h-11 px-4"
                  {...register("password")}
                  disabled={isSubmitting}
                  placeholder="••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400 font-bold">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* CONFIRM */}
              <div>
                <label className="block text-sm font-bold text-cyan-300 mb-2 tracking-wider">
                  CONFIRM PASSWORD
                </label>
                <input
                  type="password"
                  className="w-full bg-[#0a0e27] border-2 border-cyan-400/40 text-white h-11 px-4"
                  {...register("confirmPassword")}
                  disabled={isSubmitting}
                  placeholder="••••••"
                />
                {errors.confirmPassword ? (
                  <p className="mt-1 text-xs text-red-400 font-bold">
                    {errors.confirmPassword.message}
                  </p>
                ) : (
                  pwd && (
                    <p className="mt-1 text-xs text-gray-500">
                      Mật khẩu ≥ 6 ký tự
                    </p>
                  )
                )}
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="w-full h-11 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-black tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <UserPlus size={18} />
                {isSubmitting ? "CREATING..." : "CREATE ACCOUNT"}
              </button>

              {/* MESSAGE */}
              {serverMsg && (
                <div
                  className={`p-3 border-2 text-center text-sm font-bold ${
                    isSuccess
                      ? "border-green-400/40 text-green-400 bg-green-900/20"
                      : "border-red-400/40 text-red-400 bg-red-900/20"
                  }`}
                >
                  {serverMsg}
                </div>
              )}
            </form>

            {/* FOOT NOTE */}
            <div className="mt-8 pt-5 border-t border-cyan-400/20">
              <p className="text-center text-xs text-gray-500 font-mono">
                USER REGISTRATION • ENCRYPTED CHANNEL
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ===================== FOOTER ===================== */}
      <SiteFooter />
    </>
  );
}
