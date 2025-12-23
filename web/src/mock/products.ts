import type { Product } from "@/types/product";

const ELECTRONIC_NAMES = [
  "Điện thoại thông minh",
  "Laptop văn phòng",
  "Tai nghe Bluetooth",
  "Chuột không dây",
  "Bàn phím cơ",
  "Màn hình máy tính",
  "Loa Bluetooth",
  "Camera kỹ thuật số",
  "Sạc nhanh",
  "Pin dự phòng",
  "Máy tính bảng",
  "Smart TV",
  "Đồng hồ thông minh",
  "Router WiFi",
  "Ổ cứng SSD",
  "Ổ cứng HDD",
  "Thanh RAM",
  "Card đồ họa",
  "Máy in laser",
  "Máy scan",
  "Webcam Full HD",
  "Micro thu âm",
  "Máy chiếu mini",
  "Máy chơi game console",
  "Tay cầm chơi game",
  "Quạt tản nhiệt CPU",
  "Vỏ case máy tính",
  "Nguồn máy tính",
  "Bo mạch chủ",
  "Bộ vi xử lý CPU",
  "Máy đọc sách điện tử",
  "Thiết bị nhà thông minh",
  "Camera an ninh",
  "Chuông cửa thông minh",
  "Máy hút bụi thông minh",
  "Robot lau nhà",
  "Máy lọc không khí",
  "Máy điều hòa",
  "Tủ lạnh",
  "Máy giặt",
  "Lò vi sóng",
  "Bếp từ",
  "Nồi chiên không dầu",
  "Máy pha cà phê",
  "Máy ép trái cây",
  "Máy xay sinh tố",
  "Máy sấy tóc",
  "Máy cạo râu",
  "Bàn ủi hơi nước",
  "Máy nước nóng"
];

const BRANDS = ["Samsung", "Apple", "Sony", "Xiaomi", "Asus"];

export const PRODUCTS: Product[] = Array.from({ length: 50 }, (_, i) => {
  const n = i + 1;

  return {
    _id: `p${n}`,
    title: ELECTRONIC_NAMES[i],
    slug: `san-pham-${n}`,
    price: 500_000 + n * 150_000,
    images: [
      `/IMAGES/${n <= 4 ? n : "ham"}.png`
    ],
    stock: n % 8 === 0 ? 0 : ((n * 5) % 30) + 1,
    rating: (n % 5) + 1,
    brand: BRANDS[n % BRANDS.length],
    variants: [],
    description: "Mô tả sản phẩm điện tử",
    category: "electronics",
  } satisfies Product;
});
