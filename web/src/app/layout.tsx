import "./globals.css";
import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import Providers from "./providers";

/* ================= FONT ================= */
const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
});

/* ================= META ================= */
export const metadata: Metadata = {
  title: "Phúc Electronics",
  description: "Future tech, today",
};

/* ================= LAYOUT ================= */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes grid {
            0% { transform: translateY(0); }
            100% { transform: translateY(60px); }
          }
          
          @keyframes beam {
            0%, 100% { opacity: 0; transform: translateY(0); }
            50% { opacity: 1; transform: translateY(100px); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            50% { transform: translateY(-100px) translateX(50px); }
          }
        `}} />
      </head>
      <body
        className={`
          ${beVietnam.variable}
          min-h-screen
          font-sans
          text-white
          bg-[#0a0e27]
          overflow-x-hidden
          relative
        `}
      >
        {/* ===== BACKGROUND EFFECTS ===== */}
        <div className="pointer-events-none fixed inset-0 z-[-1]">
          {/* Animated Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,247,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,247,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [animation:grid_20s_linear_infinite]" />
          
          {/* Diagonal Scanlines */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,247,255,0.03)_2px,rgba(0,247,255,0.03)_4px)]" />
          
          {/* Multiple Neon Glows */}
          <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full bg-cyan-500/20 blur-[150px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[10%] w-[500px] h-[500px] rounded-full bg-blue-600/15 blur-[120px] animate-pulse [animation-delay:1s]" />
          <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[100px] animate-pulse [animation-delay:2s]" />
          
          {/* Holographic Corner Effects */}
          <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-gradient-to-br from-cyan-500/10 to-transparent" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-gradient-to-tl from-blue-500/10 to-transparent" />
          
          {/* Moving Light Beams */}
          <div className="absolute top-0 left-1/4 w-[2px] h-full bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent [animation:beam_8s_ease-in-out_infinite]" />
          <div className="absolute top-0 right-1/3 w-[2px] h-full bg-gradient-to-b from-transparent via-blue-400/50 to-transparent [animation:beam_6s_ease-in-out_infinite] [animation-delay:2s]" />
          
          {/* Glitch Effect Overlay */}
          <div className="absolute inset-0 opacity-[0.02] bg-[url('/noise.png')] mix-blend-overlay" />
        </div>

        <Providers>
          <SiteHeader/>

          {/* ===== MAIN CONTENT ===== */}
          <main className="relative">
            <div className="container mx-auto max-w-6xl px-4 py-10">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
