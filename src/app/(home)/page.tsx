import type { NextPage } from "next";
import Head from "next/head";
import { Home } from "../../views";

const CarbonEmissions: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Carbon Wallet</title>
        <meta
          name="description"
          content="Calculate carbon emissions"
        />
      </Head>
      <Home/>
    </div>
  );
};

export default CarbonEmissions;
