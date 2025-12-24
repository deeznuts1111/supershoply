import { Terminal, Cpu, Github, Facebook, Twitter } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="relative mt-20 border-t border-cyan-500/20 bg-[#050816] py-12 overflow-hidden">
      {/* Hiệu ứng lưới nền nhẹ cho Footer */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,247,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,247,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-cyan-500 flex items-center justify-center">
                <Terminal size={18} className="text-black" />
              </div>
              <div className="text-xl font-black text-white tracking-tighter">
                PHÚC<span className="text-cyan-400">.SIGMA</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Hệ thống cung cấp thiết bị điện tử thế hệ mới. 
              Trải nghiệm công nghệ tương lai ngay hôm nay.
            </p>
          </div>

          {/* Quick Links / Status */}
          <div className="flex flex-col gap-2">
            <div className="text-xs font-bold text-cyan-400 tracking-[0.2em] mb-2 uppercase">Hệ thống</div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Máy chủ: Hoạt động ổn định
            </div>
            <div className="text-sm text-gray-500 mt-2 italic">
              "Technology is the bridge to the future."
            </div>
          </div>

          {/* Social / Contact */}
          <div className="flex flex-col md:items-end gap-4">
            <div className="text-xs font-bold text-cyan-400 tracking-[0.2em] uppercase">Kết nối mạng lưới</div>
            <div className="flex gap-4">
              <button className="p-2 border border-white/10 hover:border-cyan-400 hover:text-cyan-400 transition-all">
                <Github size={20} />
              </button>
              <button className="p-2 border border-white/10 hover:border-blue-500 hover:text-blue-500 transition-all">
                <Facebook size={20} />
              </button>
              <button className="p-2 border border-white/10 hover:border-cyan-300 hover:text-cyan-300 transition-all">
                <Twitter size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-[10px] text-gray-500 tracking-widest uppercase font-bold">
            © {new Date().getFullYear()} PHÚC SIGMA. ALL SYSTEMS OPERATIONAL.
          </div>
          <div className="flex items-center gap-6 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            <span className="hover:text-cyan-400 cursor-pointer transition-colors">Bảo mật</span>
            <span className="hover:text-cyan-400 cursor-pointer transition-colors">Điều khoản</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
