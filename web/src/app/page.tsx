"use client";

import { Suspense } from "react"; // Thêm Suspense
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  ShoppingCart,
  LayoutDashboard,
  Zap,
  Cpu,
  ShieldCheck,
  Terminal,
  Binary,
  Sparkles,
} from "lucide-react";
import SiteFooter from "@/components/SiteFooter";

// Tách nội dung ra Component riêng để bọc Suspense
function HomeContent() {
  return (
    <>
      <main className="relative overflow-hidden">
        {/* ================= HERO - HIGH CONTRAST ================= */}
        <section className="relative py-32 min-h-[85vh] flex items-center">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,247,255,0.2)_0%,transparent_70%)] animate-pulse" />
              <div className="absolute inset-0 border border-cyan-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
            </div>
          </div>

          <div className="container mx-auto max-w-7xl px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0a0e27] border border-cyan-400 mb-8 shadow-[0_0_15px_rgba(0,247,255,0.3)]"
            >
              <Terminal size={16} className="text-cyan-400" />
              <span className="text-sm font-bold text-white tracking-wider">
                SYSTEM ONLINE // V4.2.1
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none">
                <span className="relative inline-block text-[#061e33] drop-shadow-[0_0_2px_rgba(0,247,255,0.5)]">
                  PHÚC ELECTRONIC
                </span>
              </h1>
              
              <div className="mt-6 flex items-center justify-center gap-2">
                <Binary size={20} className="text-blue-900" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#0a2540] tracking-[0.3em]">
                  FUTURE • TECH • TODAY
                </h2>
                <Binary size={20} className="text-blue-900" />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 text-lg sm:text-xl text-[#0f172a] max-w-3xl mx-auto leading-relaxed font-semibold"
            >
              Khám phá thế giới công nghệ tương lai. Nền tảng thương mại điện tử 
              <span className="text-blue-700 font-black"> thế hệ mới</span>, nơi hiện thực 
              gặp gỡ không gian ảo.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-14 flex flex-wrap justify-center gap-4"
            >
              <Link href="/shop">
                <button className="group relative px-10 py-5 bg-[#0a0e27] text-cyan-400 font-black text-lg transition-all hover:shadow-[0_0_20px_rgba(0,247,255,0.6)]">
                  <span className="relative flex items-center gap-2">
                    <ShoppingBag size={20} /> VÀO SHOP
                  </span>
                </button>
              </Link>

              <Link href="/cart">
                <button className="group relative px-10 py-5 border-2 border-[#0a2540] text-[#0a2540] font-black text-lg transition-all hover:bg-[#0a2540] hover:text-white">
                  <span className="relative flex items-center gap-2">
                    <ShoppingCart size={20} /> CART
                  </span>
                </button>
              </Link>

              <Link href="/admin">
                <button className="group relative px-10 py-5 border-2 border-purple-900 text-purple-900 font-black text-lg transition-all hover:bg-purple-900 hover:text-white">
                  <span className="relative flex items-center gap-2">
                    <LayoutDashboard size={20} /> ADMIN
                  </span>
                </button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-20 flex flex-wrap justify-center gap-12"
            >
              {[
                { label: "PRODUCTS", value: "500+" },
                { label: "USERS", value: "10K+" },
                { label: "ORDERS", value: "25K+" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-4xl font-black text-[#0a2540]">{stat.value}</div>
                  <div className="text-xs text-blue-800 font-bold tracking-[0.2em] mt-2">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ================= FEATURE CARDS ================= */}
        <section className="container mx-auto max-w-7xl px-4 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black text-[#0a2540]">
              FUTURISTIC SYSTEM
            </h2>
            <div className="mt-4 h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative rounded-none border-2 border-cyan-400/40 bg-gradient-to-br from-[#0a0e27] to-[#0f172a] p-8 overflow-hidden transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(0,247,255,0.3)]"
              >
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-none bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-300 flex items-center justify-center mb-6 border border-cyan-400/40 group-hover:border-cyan-400 transition-all group-hover:shadow-[0_0_20px_rgba(0,247,255,0.4)]">
                    <v.icon size={26} />
                  </div>

                  <h3 className="text-2xl font-black text-white mb-3 tracking-tight">
                    {v.title}
                  </h3>

                  <p className="text-gray-300 leading-relaxed">
                    {v.desc}
                  </p>

                  <div className="mt-6 h-[2px] bg-gradient-to-r from-cyan-400/50 to-transparent" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= CALL TO ACTION ================= */}
        <section className="container mx-auto max-w-7xl px-4 pb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-none border-2 border-cyan-400 bg-gradient-to-br from-[#0a0e27] via-[#0f172a] to-[#1e293b] p-12 overflow-hidden"
          >
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-cyan-300"><Sparkles size={28} /></span>
                  <h2 className="text-4xl font-black text-white">
                    SYSTEM OPERATING
                  </h2>
                </div>
                <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
                  Truy cập vào mạng lưới thương mại điện tử tiên tiến nhất. 
                  Kết nối ngay để khám phá công nghệ tương lai.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/shop">
                  <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-black hover:shadow-[0_0_30px_rgba(0,247,255,0.6)] transition-all">
                    PRODUCTS
                  </button>
                </Link>

                <Link href="/cart">
                  <button className="px-8 py-4 border-2 border-cyan-400 text-white font-black hover:bg-cyan-500/20 transition-all">
                    CART
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

// Export chính với Suspense
export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}

const values = [
  {
    title: "HYPER SPEED",
    desc: "Tối ưu tốc độ xử lý với công nghệ AI tiên tiến, đảm bảo trải nghiệm mượt mà trên mọi thiết bị.",
    icon: Zap,
  },
  {
    title: "QUANTUM TECH",
    desc: "Kiến trúc hệ thống thế hệ mới, dễ dàng mở rộng và tích hợp với các nền tảng blockchain.",
    icon: Cpu,
  },
  {
    title: "CYBER SHIELD",
    desc: "Bảo mật đa lớp với mã hóa quân sự, bảo vệ dữ liệu người dùng ở mức độ tối đa.",
    icon: ShieldCheck,
  },
];
