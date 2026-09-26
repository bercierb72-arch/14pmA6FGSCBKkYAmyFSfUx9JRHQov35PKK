import { PaymentDashboard } from "@/components/payment-dashboard";
import { withNwcClient } from "@/lib/nwc";

async function getInitialWalletData() {
  try {
    const [balanceResponse, transactionsResponse] = await Promise.all([
      withNwcClient(async (client) => client.getBalance()),
      withNwcClient(async (client) =>
        client.listTransactions({
          limit: 10,
          offset: 0,
          unpaid: false,
        }),
      ),
    ]);

    return {
      initialBalance: balanceResponse.balance,
      initialTransactions: transactionsResponse.transactions,
      initialError: null,
    };
  } catch (error) {
    return {
      initialBalance: null,
      initialTransactions: [],
      initialError: error instanceof Error ? error.message : "Unable to load wallet data.",
    };
  }
}

export default async function Home() {
  const { initialBalance, initialTransactions, initialError } = await getInitialWalletData();

  return (
    <PaymentDashboard
      initialBalance={initialBalance}
      initialError={initialError}
      initialTransactions={initialTransactions}
    />
  );
}
