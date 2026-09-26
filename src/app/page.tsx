import { PaymentDashboard } from "@/components/payment-dashboard";
import { withNwcClient } from "@/lib/nwc";

async function getInitialWalletData() {
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

    return {
      initialBalance: walletSnapshot.balance,
      initialTransactions: walletSnapshot.transactions,
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
