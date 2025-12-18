export type MinProduct = {
    slug: string;
    title: string;
    price: number;
    brand: string;
    rating: string;
    image: string;
    stock: number;
};

export const MIN_PRODUCTS: MinProduct[] = [
    { slug: "sp-1", title: "Áo thun cổ tròn", price: 129000, brand: "phúc", rating: "nhiều sao", image: "/placeholder.svg", stock: 12 },
    { slug: "sp-2", title: "Quần jeans slim", price: 459000, brand: "phúc", rating: "nhiều sao", image: "/placeholder.svg", stock: 0 },
    { slug: "sp-3", title: "Giày sneaker basic", price: 799000, brand: "phúc", rating: "nhiều sao", image: "/placeholder.svg", stock: 5 },
    { slug: "sp-4", title: "Túi tote canvas", price: 99000, brand: "phúc", rating: "nhiều sao", image: "/placeholder.svg", stock: 20 },
    { slug: "sp-5", title: "Mũ lưỡi trai", price: 69000, brand: "phúc", rating: "nhiều sao", image: "/placeholder.svg", stock: 3 },
    { slug: "sp-6", title: "Áo sơ mi kẻ", price: 259000, brand: "phúc", rating: "nhiều sao", image: "/placeholder.svg", stock: 8 },
    { slug: "sp-7", title: "Váy midi", price: 349000, brand: "phúc", rating: "nhiều sao", image: "/placeholder.svg", stock: 2 },
    { slug: "sp-8", title: "Áo khoác gió", price: 559000, brand: "phúc", rating: "nhiều sao", image: "/placeholder.svg", stock: 15 },
    { slug: "sp-9", title: "Áo khoác", price: 559678000, brand: "phúc", rating: "nhiều sao", image: "/placeholder.svg", stock: 999 },
];