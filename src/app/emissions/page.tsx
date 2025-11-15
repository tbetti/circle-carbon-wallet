import type { NextPage } from "next";
import Head from "next/head";
import { Home } from "../../views/carbonEmissions";

const EmissionsPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Carbon Calculator - Carbon Bridge</title>
        <meta
          name="description"
          content="Calculate your GPU carbon emissions and offset them with verified credits"
        />
      </Head>
      <Home />
    </div>
  );
};

export default EmissionsPage;
