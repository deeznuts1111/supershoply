"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ShoppingCart, LayoutDashboard } from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      {/* ===== HERO ===== */}
      <section className="container mx-auto max-w-7xl px-4 py-24 text-center">
        {/* Glow background */}
        <div className="absolute inset-0 -z-10 flex justify-center">
          <div className="w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight"
        >
          Chào mừng đến{" "}
          <span className="text-blue-600">Shoply</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-6 text-lg text-gray-600 max-w-xl mx-auto"
        >
          Nền tảng demo thương mại điện tử hiện đại với catalog, giỏ hàng,
          đơn hàng và trang quản trị.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 flex justify-center gap-4"
        >
          <Link href="/shop">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full bg-black text-white font-bold"
            >
              Khám phá cửa hàng
            </motion.button>
          </Link>

          <Link href="/cart">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full border border-gray-300 font-semibold"
            >
              Xem giỏ hàng
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* ===== FEATURE CARDS ===== */}
      <section className="container mx-auto max-w-7xl px-4 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{
                y: -6,
                boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
              }}
              className="rounded-2xl border border-gray-200 bg-white p-6 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-4">
                <f.icon size={22} />
              </div>
              <h3 className="text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{f.desc}</p>

              <Link href={f.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="mt-4 inline-block font-semibold text-blue-600"
                >
                  Đi tới →
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}

/* ===== DATA ===== */
const features = [
  {
    title: "Cửa hàng",
    desc: "Duyệt danh sách sản phẩm, tìm kiếm, lọc.",
    href: "/shop",
    icon: ShoppingBag,
  },
  {
    title: "Giỏ hàng",
    desc: "Thêm sản phẩm, tính tổng tiền, checkout.",
    href: "/cart",
    icon: ShoppingCart,
  },
  {
    title: "Quản trị",
    desc: "CRUD sản phẩm, quản lý đơn hàng.",
    href: "/admin",
    icon: LayoutDashboard,
  },
];
