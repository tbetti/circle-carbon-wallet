import type { NextPage } from "next";
import Head from "next/head";
import { ListingView } from "../../views";

const ListingPage: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Listing</title>
        <meta
          name="description"
          content="Listing Details"
        />
      </Head>
      <ListingView />
    </div>
  );
};

export default ListingPage;
