import { NextResponse } from "next/server";
import { PRODUCTS } from "@/mock/products";
import { calcTotals } from "@/lib/checkout";

type Input = {
  customerName: string;
  customerPhone?: string;
  customerAddress: string;
  paymentMethod: "cod" | "banking" | "momo";
  note?: string;
  items: { slug: string; quantity: number }[];
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Input;

    if (!body?.items?.length) {
      return NextResponse.json({ ok: false, error: { code: "EMPTY_CART", message: "Giỏ hàng trống" } }, { status: 400 });
    }
    if (!body.customerName || !body.customerAddress) {
      return NextResponse.json({ ok: false, error: { code: "BAD_PAYLOAD", message: "Thiếu thông tin khách hàng" } }, { status: 400 });
    }

    // Tra cứu sản phẩm từ mock PRODUCTS (nguồn sự thật tạm thời)
    const snapshot = body.items.map((it) => {
      const p = PRODUCTS.find((x) => x.slug === it.slug);
      if (!p) throw new Error(`Product not found: ${it.slug}`);
      if ((p.stock ?? 0) < it.quantity) throw new Error(`OUT_OF_STOCK:${p.title}`);
      return {
        productId: p._id,
        slug: p.slug,
        title: p.title,
        price: p.price,
        quantity: it.quantity,
        image: p.images?.[0],
      };
    });

    const totals = calcTotals(snapshot.map((s) => ({ price: s.price, quantity: s.quantity })), body.customerAddress);
    const order = {
      id: `ORD-${Date.now()}`,
      items: snapshot,
      ...totals,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerAddress: body.customerAddress,
      paymentMethod: body.paymentMethod,
      note: body.note,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Giả lập: không lưu DB; trả về order để FE hiển thị
    return NextResponse.json({ ok: true, order });
  } catch (e: unknown) {
    const msg = String(e?.message || "");
    if (msg.startsWith("OUT_OF_STOCK:")) {
      return NextResponse.json({ ok: false, error: { code: "OUT_OF_STOCK", message: msg.replace("OUT_OF_STOCK:", "") } }, { status: 400 });
    }
    if (msg.includes("Product not found")) {
      return NextResponse.json({ ok: false, error: { code: "NOT_FOUND", message: msg } }, { status: 404 });
    }
    return NextResponse.json({ ok: false, error: { code: "INTERNAL", message: "Checkout failed" } }, { status: 500 });
  }

}
