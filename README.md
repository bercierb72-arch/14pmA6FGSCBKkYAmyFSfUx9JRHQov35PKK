# Lightning Payment App

A simple Next.js payment app inspired by [startwithbitcoin](https://github.com/bramkanstein/startwithbitcoin). It uses Nostr Wallet Connect (NWC) with the Alby SDK so you can:

- check your Lightning balance
- create invoices to receive sats
- pay BOLT11 invoices
- review recent transactions and payment state updates

## Prerequisites

- Node.js 22 or newer
- an NWC-capable wallet connection string

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Add your wallet connection string:

   ```bash
   NWC_URL=nostr+walletconnect://...
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Available scripts

- `npm run dev` - run the app locally
- `npm run lint` - lint the project
- `npm run build` - create a production build
- `npm run start` - start the production server

## Notes

- Keep `NWC_URL` in `.env.local` only. The app reads it server-side through API routes.
- The dashboard shows the latest 10 transactions returned by the wallet, including pending payment state updates.
