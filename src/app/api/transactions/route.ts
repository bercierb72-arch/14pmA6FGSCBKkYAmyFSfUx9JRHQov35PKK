import { NextResponse } from "next/server";
import { withNwcClient } from "@/lib/nwc";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const transactions = await withNwcClient(async (client) =>
      client.listTransactions({
        limit: 10,
        offset: 0,
        unpaid: false,
      }),
    );

    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to fetch transactions." },
      { status: 500 },
    );
  }
}
