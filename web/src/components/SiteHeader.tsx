"use client";

import { useState, useEffect } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  /* ===== Scroll effect ===== */
  const { scrollY } = useScroll();
  const headerHeight = useTransform(scrollY, [0, 60], ["80px", "64px"]);
  const headerBg = useTransform(
    scrollY,
    [0, 60],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.85)"]
  );

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      style={{ height: headerHeight, backgroundColor: headerBg }}
      className={cn(
        "sticky top-0 z-50 w-full flex items-center",
        "transition-all duration-300",
        isScrolled &&
          "backdrop-blur-xl shadow-sm border-b border-gray-100"
      )}
    >
      <div className="container mx-auto max-w-7xl px-4 flex items-center justify-between gap-4">
        {/* ===== LOGO ===== */}
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 8, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shadow-lg"
          >
            <ShoppingBag className="w-5 h-5 text-white" />
          </motion.div>

          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-black tracking-tight hidden sm:block"
          >
            Shoply<span className="text-blue-600">.</span>
          </motion.span>
        </Link>

        {/* ===== NAV DESKTOP ===== */}
        <nav className="hidden md:flex items-center gap-2 bg-gray-100/80 p-1 rounded-full border border-gray-200/50 backdrop-blur-md">
          {nav.map((item) => {
            const active = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{
                    y: -2,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={cn(
                    "relative px-6 py-2 text-sm font-semibold rounded-full cursor-pointer",
                    active
                      ? "bg-black text-white"
                      : "text-gray-600 hover:text-black"
                  )}
                >
                  {item.name}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* ===== ACTIONS ===== */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* SEARCH */}
          <div className="relative flex items-center">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.form
                  initial={{ width: 0, opacity: 0, x: 20 }}
                  animate={{ width: 220, opacity: 1, x: 0 }}
                  exit={{ width: 0, opacity: 0, x: 20 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  onSubmit={handleSearch}
                  className="absolute right-full mr-2"
                >
                  <input
                    autoFocus
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Tìm sản phẩm..."
                    className="w-full h-9 px-4 rounded-full border border-gray-200 bg-white shadow-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </motion.form>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSearchOpen((v) => !v)}
              className="p-2 rounded-full text-gray-700 hover:bg-gray-100"
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </motion.button>
          </div>

          {/* CART */}
          <motion.div
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <CartIndicator />
          </motion.div>

          <div className="hidden sm:block h-6 w-px bg-gray-200 mx-1" />

          {/* AUTH */}
          <div className="hidden sm:flex items-center gap-1">
            <Link href="/login">
              <motion.button
                whileHover={{ x: -2 }}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-blue-600"
              >
                Đăng nhập
              </motion.button>
            </Link>

            <Link href="/register">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 text-sm font-bold bg-black text-white rounded-full"
              >
                Đăng ký
              </motion.button>
            </Link>
          </div>

          {/* MOBILE */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            className="md:hidden p-2 rounded-full hover:bg-gray-100"
          >
            <Menu size={24} />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
