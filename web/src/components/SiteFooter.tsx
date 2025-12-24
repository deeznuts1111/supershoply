export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-blue-100 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto max-w-7xl px-4 py-10 flex flex-col sm:flex-row justify-between gap-6 text-sm text-gray-500">
        <div>
          <div className="text-lg font-black text-blue-600">Shoply</div>
          <p className="mt-2 max-w-sm">
            Cửa hàng đồ điện tử hiện đại – nhanh – chất lượng cao.
          </p>
        </div>

        <div className="text-xs text-gray-400 flex items-end">
          © {new Date().getFullYear()} Shoply. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
