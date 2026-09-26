import { NextResponse } from "next/server";
import { withNwcClient } from "@/lib/nwc";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: {
    amount?: number;
    description?: string;
    expiry?: number;
  };

  try {
    body = (await request.json()) as {
      amount?: number;
      description?: string;
      expiry?: number;
    };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {

    const amount = Number(body.amount);
    const expiry = Number(body.expiry ?? 3600);
    const description = body.description?.trim();

    if (!Number.isInteger(amount) || amount <= 0) {
      return NextResponse.json({ error: "Amount must be a positive number of sats." }, { status: 400 });
    }

    if (!description) {
      return NextResponse.json({ error: "Description is required." }, { status: 400 });
    }

    if (!Number.isInteger(expiry) || expiry <= 0) {
      return NextResponse.json({ error: "Expiry must be a positive number of seconds." }, { status: 400 });
    }

    const invoice = await withNwcClient(async (client) =>
      client.makeInvoice({
        amount,
        description,
        expiry,
      }),
    );

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create invoice." },
      { status: 500 },
    );
  }
}
