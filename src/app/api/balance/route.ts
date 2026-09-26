import { NextResponse } from "next/server";
import { withNwcClient } from "@/lib/nwc";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const balance = await withNwcClient(async (client) => client.getBalance());
    return NextResponse.json(balance);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to fetch balance." },
      { status: 500 },
    );
  }
}
