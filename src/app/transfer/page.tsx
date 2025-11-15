"use client";

import Head from "next/head";
import { TransferView } from "../../views";

export default function TransferPage() {
  return (
    <div>
      <Head>
        <title>Transfer</title>
        <meta name="description" content="Crosschain transfer" />
      </Head>
      <main className="p-6">
        <TransferView />
      </main>
    </div>
  );
}
