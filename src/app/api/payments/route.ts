import { NextResponse } from "next/server";
import { withNwcClient } from "@/lib/nwc";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { invoice?: string };
    const invoice = body.invoice?.trim();

    if (!invoice) {
      return NextResponse.json({ error: "A BOLT11 invoice is required." }, { status: 400 });
    }

    const payment = await withNwcClient(async (client) => client.payInvoice({ invoice }));

    return NextResponse.json(payment);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to pay invoice." },
      { status: 500 },
    );
  }
}
