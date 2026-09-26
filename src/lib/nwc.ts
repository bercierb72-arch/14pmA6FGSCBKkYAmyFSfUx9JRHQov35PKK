import { NWCClient } from "@getalby/sdk";

function getNwcUrl() {
  const nostrWalletConnectUrl = process.env.NWC_URL;

  if (!nostrWalletConnectUrl) {
    throw new Error("Missing NWC_URL. Add it to your .env.local file.");
  }

  return nostrWalletConnectUrl;
}

export async function withNwcClient<T>(callback: (client: NWCClient) => Promise<T>) {
  const client = new NWCClient({
    nostrWalletConnectUrl: getNwcUrl(),
  });

  try {
    return await callback(client);
  } finally {
    client.close();
  }
}
