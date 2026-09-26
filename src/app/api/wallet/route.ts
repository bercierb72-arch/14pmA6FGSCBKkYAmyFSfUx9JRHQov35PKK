import { NextResponse } from "next/server";
import { withNwcClient } from "@/lib/nwc";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const walletSnapshot = await withNwcClient(async (client) => {
      const [balance, transactions] = await Promise.all([
        client.getBalance(),
        client.listTransactions({
          limit: 10,
          offset: 0,
        }),
      ]);

      return {
        balance: balance.balance,
        transactions: transactions.transactions,
      };
    });

    return NextResponse.json(walletSnapshot);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to fetch wallet data." },
      { status: 500 },
    );
  }
}
