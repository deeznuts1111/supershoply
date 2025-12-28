"use client";
import SiteFooter from "@/components/SiteFooter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValues } from "@/app/features/auth/schemas";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/services/admin";
import { Terminal, ShieldCheck, Binary } from "lucide-react";

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
        localStorage.setItem("adminToken", result.token);
        localStorage.setItem("adminUser", JSON.stringify(result.user));
        router.push("/admin");
      } else {
        setServerMsg("Bạn không có quyền truy cập admin");
      }
    } catch (error) {
      setServerMsg(error instanceof Error ? error.message : "Đăng nhập thất bại");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0e27] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,247,255,0.15)_0%,transparent_70%)] animate-pulse" />
          <div className="absolute inset-0 border border-cyan-500/10 rounded-full animate-[spin_20s_linear_infinite]" />
        </div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Corner Decorations */}
        <div className="absolute -top-4 -left-4 w-16 h-16 border-t-2 border-l-2 border-cyan-400 opacity-50" />
        <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b-2 border-r-2 border-cyan-400 opacity-50" />

        <div className="relative bg-gradient-to-br from-[#0f172a] to-[#1e293b] border-2 border-cyan-400/40 p-8 shadow-[0_0_50px_rgba(0,247,255,0.2)]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-[#0a0e27] border border-cyan-400 mb-6 shadow-[0_0_15px_rgba(0,247,255,0.3)]">
              <Terminal size={16} className="text-cyan-400" />
              <span className="text-sm font-bold text-white tracking-wider">
                ADMIN ACCESS
              </span>
            </div>

            <h1 className="text-4xl font-black text-white tracking-tight mb-2">
              ADMIN <span className="text-cyan-400">PORTAL</span>
            </h1>
            
            <div className="flex items-center justify-center gap-2 mt-3">
              <Binary size={16} className="text-cyan-400/60" />
              <p className="text-cyan-300/80 text-sm tracking-[0.2em] font-bold">
                SECURE LOGIN
              </p>
              <Binary size={16} className="text-cyan-400/60" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-cyan-300 mb-2 tracking-wider">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full bg-[#0a0e27] border-2 border-cyan-400/40 text-white h-12 px-4 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,247,255,0.3)] transition-all placeholder:text-gray-600"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  {...register("email")}
                  disabled={isSubmitting}
                  placeholder="admin@system.local"
                />
                {errors.email && (
                  <div className="absolute -bottom-6 left-0 text-xs text-red-400 font-bold">
                    {errors.email.message}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-sm font-bold text-cyan-300 mb-2 tracking-wider">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full bg-[#0a0e27] border-2 border-cyan-400/40 text-white h-12 px-4 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,247,255,0.3)] transition-all placeholder:text-gray-600"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  {...register("password")}
                  disabled={isSubmitting}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <div className="absolute -bottom-6 left-0 text-xs text-red-400 font-bold">
                    {errors.password.message}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="group relative w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-black tracking-wider hover:shadow-[0_0_30px_rgba(0,247,255,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck size={20} />
                {isSubmitting ? "AUTHENTICATING..." : "ACCESS SYSTEM"}
              </button>
            </div>

            {serverMsg && (
              <div className="p-4 border-2 border-red-400/40 bg-red-900/20 backdrop-blur-sm">
                <p className="text-sm text-red-400 font-bold tracking-wide text-center">
                  ⚠ {serverMsg}
                </p>
              </div>
            )}
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-cyan-400/20">
            <p className="text-center text-xs text-gray-500 font-mono">
              PROTECTED AREA • AUTHORIZED ACCESS ONLY
            </p>
          </div>
        </div>
      </div>
    </main>
    <SiteFooter />
  );
}
