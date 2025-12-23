import type { Product } from "@/types/product";

const ELECTRONIC_NAMES = [
  "Điện thoại", "Laptop", "Tai nghe", "Chuột", "Bàn phím",
  "Màn hình", "Loa", "Camera", "Sạc nhanh", "Pin dự phòng",
  "Tablet", "Smart TV", "Đồng hồ thông minh", "Router WiFi",
  "Ổ cứng SSD", "Ổ cứng HDD", "RAM", "Card đồ họa",
  "Máy in", "Scanner", "Webcam", "Micro", "Máy chiếu",
  "Máy chơi game", "Tay cầm", "Quạt tản nhiệt",
  "Case PC", "Nguồn máy tính", "Mainboard",
  "CPU", "Máy đọc sách", "Thiết bị IoT",
  "Camera an ninh", "Chuông cửa thông minh",
  "Máy hút bụi", "Robot lau nhà", "Máy lọc không khí",
  "Máy lạnh", "Tủ lạnh", "Máy giặt",
  "Lò vi sóng", "Bếp điện", "Nồi chiên",
  "Máy pha cà phê", "Máy ép trái cây",
  "Máy xay", "Máy sấy tóc"
];

const BRANDS = ["Samsung", "Apple", "Sony", "Xiaomi", "Asus"];

export const PRODUCTS: Product[] = Array.from({ length: 50 }, (_, i) => {
  const n = i + 1;

  return {
    _id: `p${n}`,
    title: `${ELECTRONIC_NAMES[i]} ${n}`,
    slug: `san-pham-${n}`,
    price: 500000 + n * 150000,
    images: [
      `/IMAGES/${n <= 4 ? n : "ham"}.png`
    ],
    stock: n % 8 === 0 ? 0 : ((n * 5) % 30) + 1,
    rating: (n % 5) + 1,
    brand: BRANDS[n % BRANDS.length],
    variants: [],
    description: `Mô tả chi tiết cho ${ELECTRONIC_NAMES[i]}`,
    category: "electronics",
  } satisfies Product;
});
