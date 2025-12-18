import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json('{ status: "ok", version: "m1", products: <n>}');
}