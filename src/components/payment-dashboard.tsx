"use client";

import { FormEvent, useMemo, useState } from "react";

type InvoiceResponse = {
  invoice: string;
  payment_hash: string;
  expires_at?: number;
};

type PaymentResponse = {
  preimage: string;
  fees_paid: number;
};

type Transaction = {
  type: "incoming" | "outgoing";
  state: "settled" | "pending" | "failed" | "accepted";
  amount: number;
  description: string;
  fees_paid: number;
  created_at: number;
  settled_at: number;
  payment_hash: string;
};

type BalanceResponse = {
  balance: number;
};

type TransactionsResponse = {
  transactions: Transaction[];
  total_count: number;
};

type PaymentDashboardProps = {
  initialBalance: number | null;
  initialTransactions: Transaction[];
  initialError: string | null;
};

const defaultInvoiceForm = {
  amount: "1000",
  description: "AI service payment",
  expiry: "3600",
};

async function parseResponse<T>(response: Response): Promise<T> {
  const data: unknown = await response.json();

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "error" in data && typeof data.error === "string"
        ? data.error
        : "Request failed.";

    throw new Error(message);
  }

  return data as T;
}

function formatTimestamp(timestamp?: number) {
  if (!timestamp) {
    return "—";
  }

  return new Date(timestamp * 1000).toLocaleString();
}

export function PaymentDashboard({ initialBalance, initialTransactions, initialError }: PaymentDashboardProps) {
  const [balance, setBalance] = useState<number | null>(initialBalance);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(initialError);

  const [invoiceForm, setInvoiceForm] = useState(defaultInvoiceForm);
  const [invoiceResult, setInvoiceResult] = useState<InvoiceResponse | null>(null);
  const [invoiceError, setInvoiceError] = useState<string | null>(null);
  const [invoicePending, setInvoicePending] = useState(false);

  const [bolt11, setBolt11] = useState("");
  const [paymentResult, setPaymentResult] = useState<PaymentResponse | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentPending, setPaymentPending] = useState(false);

  const stats = useMemo(() => {
    const incoming = transactions.filter((transaction) => transaction.type === "incoming");
    const outgoing = transactions.filter((transaction) => transaction.type === "outgoing");

    return {
      incomingCount: incoming.length,
      outgoingCount: outgoing.length,
      lastActivity: formatTimestamp(transactions[0]?.settled_at || transactions[0]?.created_at),
    };
  }, [transactions]);

  async function refreshWallet() {
    setLoadingWallet(true);
    setRefreshError(null);

    try {
      const [balanceResponse, transactionsResponse] = await Promise.all([
        fetch("/api/balance", { cache: "no-store" }).then((response) => parseResponse<BalanceResponse>(response)),
        fetch("/api/transactions", { cache: "no-store" }).then((response) => parseResponse<TransactionsResponse>(response)),
      ]);

      setBalance(balanceResponse.balance);
      setTransactions(transactionsResponse.transactions);
    } catch (error) {
      setRefreshError(error instanceof Error ? error.message : "Unable to load wallet data.");
    } finally {
      setLoadingWallet(false);
    }
  }

  async function handleCreateInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setInvoicePending(true);
    setInvoiceError(null);
    setInvoiceResult(null);

    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(invoiceForm.amount),
          description: invoiceForm.description,
          expiry: Number(invoiceForm.expiry),
        }),
      });

      const data = await parseResponse<InvoiceResponse>(response);
      setInvoiceResult(data);
      await refreshWallet();
    } catch (error) {
      setInvoiceError(error instanceof Error ? error.message : "Unable to create invoice.");
    } finally {
      setInvoicePending(false);
    }
  }

  async function handlePayInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPaymentPending(true);
    setPaymentError(null);
    setPaymentResult(null);

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invoice: bolt11 }),
      });

      const data = await parseResponse<PaymentResponse>(response);
      setPaymentResult(data);
      setBolt11("");
      await refreshWallet();
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : "Unable to pay invoice.");
    } finally {
      setPaymentPending(false);
    }
  }

  return (
    <div className="page-shell">
      <section className="hero">
        <p className="eyebrow">Start With Bitcoin</p>
        <h1>Lightning payment app</h1>
        <p className="hero-copy">
          Connect an NWC wallet and use this dashboard to check your balance, create invoices, pay BOLT11 requests,
          and review your latest transactions.
        </p>
        <div className="hero-actions">
          <button className="primary-button" onClick={() => void refreshWallet()} type="button">
            {loadingWallet ? "Refreshing…" : "Refresh wallet"}
          </button>
          <a className="secondary-link" href="https://github.com/bramkanstein/startwithbitcoin" rel="noreferrer" target="_blank">
            Reference guide
          </a>
        </div>
      </section>

      <section className="card-grid">
        <article className="card stat-card">
          <span className="label">Balance</span>
          <strong>{balance === null ? "—" : `${balance.toLocaleString()} sats`}</strong>
        </article>
        <article className="card stat-card">
          <span className="label">Incoming payments</span>
          <strong>{stats.incomingCount}</strong>
        </article>
        <article className="card stat-card">
          <span className="label">Outgoing payments</span>
          <strong>{stats.outgoingCount}</strong>
        </article>
        <article className="card stat-card">
          <span className="label">Last activity</span>
          <strong>{stats.lastActivity}</strong>
        </article>
      </section>

      {refreshError ? <p className="feedback error">{refreshError}</p> : null}

      <section className="workspace-grid">
        <article className="card panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Receive</p>
              <h2>Create invoice</h2>
            </div>
          </div>

          <form className="stack" onSubmit={handleCreateInvoice}>
            <label className="field">
              <span>Amount (sats)</span>
              <input
                inputMode="numeric"
                min="1"
                onChange={(event) => setInvoiceForm((current) => ({ ...current, amount: event.target.value }))}
                required
                type="number"
                value={invoiceForm.amount}
              />
            </label>
            <label className="field">
              <span>Description</span>
              <input
                maxLength={140}
                onChange={(event) => setInvoiceForm((current) => ({ ...current, description: event.target.value }))}
                required
                type="text"
                value={invoiceForm.description}
              />
            </label>
            <label className="field">
              <span>Expiry (seconds)</span>
              <input
                inputMode="numeric"
                min="60"
                onChange={(event) => setInvoiceForm((current) => ({ ...current, expiry: event.target.value }))}
                required
                type="number"
                value={invoiceForm.expiry}
              />
            </label>
            <button className="primary-button" disabled={invoicePending} type="submit">
              {invoicePending ? "Creating…" : "Create Lightning invoice"}
            </button>
          </form>

          {invoiceError ? <p className="feedback error">{invoiceError}</p> : null}
          {invoiceResult ? (
            <div className="result">
              <p className="label">Invoice</p>
              <textarea readOnly rows={5} value={invoiceResult.invoice} />
              <dl>
                <div>
                  <dt>Payment hash</dt>
                  <dd>{invoiceResult.payment_hash}</dd>
                </div>
                <div>
                  <dt>Expires</dt>
                  <dd>{formatTimestamp(invoiceResult.expires_at)}</dd>
                </div>
              </dl>
            </div>
          ) : null}
        </article>

        <article className="card panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Send</p>
              <h2>Pay invoice</h2>
            </div>
          </div>

          <form className="stack" onSubmit={handlePayInvoice}>
            <label className="field">
              <span>BOLT11 invoice</span>
              <textarea
                onChange={(event) => setBolt11(event.target.value)}
                placeholder="lnbc1..."
                required
                rows={6}
                value={bolt11}
              />
            </label>
            <button className="primary-button" disabled={paymentPending} type="submit">
              {paymentPending ? "Paying…" : "Send payment"}
            </button>
          </form>

          {paymentError ? <p className="feedback error">{paymentError}</p> : null}
          {paymentResult ? (
            <div className="result">
              <p className="label">Payment sent</p>
              <dl>
                <div>
                  <dt>Preimage</dt>
                  <dd>{paymentResult.preimage}</dd>
                </div>
                <div>
                  <dt>Routing fees</dt>
                  <dd>{paymentResult.fees_paid} msats</dd>
                </div>
              </dl>
            </div>
          ) : null}
        </article>
      </section>

      <section className="card panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">History</p>
            <h2>Recent transactions</h2>
          </div>
        </div>

        {transactions.length === 0 ? (
          <p className="empty-state">No settled transactions yet.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Direction</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Settled</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.payment_hash}>
                    <td>{transaction.type === "incoming" ? "Received" : "Sent"}</td>
                    <td>{transaction.amount.toLocaleString()} sats</td>
                    <td>{transaction.description || "—"}</td>
                    <td>{transaction.state}</td>
                    <td>{formatTimestamp(transaction.settled_at || transaction.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="card panel tips">
        <div>
          <p className="eyebrow">Setup</p>
          <h2>Before you start</h2>
        </div>
        <ol>
          <li>Create or connect a Lightning wallet with Nostr Wallet Connect support.</li>
          <li>Add your NWC connection string to <code>.env.local</code> as <code>NWC_URL</code>.</li>
          <li>Run the app locally and keep your NWC secret on the server side only.</li>
        </ol>
      </section>
    </div>
  );
}
