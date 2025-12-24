"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Search, Menu, X, ShoppingBag } from "lucide-react";
import CartIndicator from "@/components/CartIndicator";
import { cn } from "@/lib/cn";

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { scrollY } = useScroll();
  const headerBg = useTransform(
    scrollY,
    [0, 60],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.9)"]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
    setIsSearchOpen(false);
  };

  const nav = [
    { name: "Cửa hàng", href: "/shop" },
    { name: "Quản trị", href: "/admin" },
  ];

  return (
    <motion.header
      style={{ backgroundColor: headerBg }}
      className="sticky top-0 z-50 backdrop-blur-xl border-b border-blue-100"
    >
      <div className="container mx-auto max-w-7xl px-4 h-16 flex items-center justify-between gap-4">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/40">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black hidden sm:block">
            Shoply<span className="text-blue-600">.</span>
          </span>
        </Link>

        {/* NAV */}
        <nav className="hidden md:flex items-center gap-2 bg-blue-50 p-1 rounded-full">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "px-6 py-2 text-sm font-semibold rounded-full transition",
                    active
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/40"
                      : "text-gray-600 hover:text-blue-600"
                  )}
                >
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          {/* SEARCH */}
          <div className="relative">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  onSubmit={handleSearch}
                  className="absolute right-full mr-2"
                >
                  <input
                    autoFocus
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Tìm sản phẩm..."
                    className="h-9 px-4 rounded-full border border-blue-200 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </motion.form>
              )}
            </AnimatePresence>

            <button
              onClick={() => setIsSearchOpen((v) => !v)}
              className="p-2 rounded-full hover:bg-blue-50"
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
          </div>

          <CartIndicator />

          <Link href="/register">
            <button className="hidden sm:block px-5 py-2 text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg shadow-blue-500/40">
              Đăng ký
            </button>
          </Link>

          <button className="md:hidden p-2 rounded-full hover:bg-blue-50">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
