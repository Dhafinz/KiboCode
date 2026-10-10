import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "KiboCode",
    version: "0.1.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
}
