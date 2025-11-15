import type { NextPage } from "next";
import Head from "next/head";
import { MarketPlaceView } from "../../views";

const MarketplacePage: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Marketplace</title>
        <meta
          name="description"
          content="Marketplace"
        />
      </Head>
      <MarketPlaceView />
    </div>
  );
};

export default MarketplacePage;
