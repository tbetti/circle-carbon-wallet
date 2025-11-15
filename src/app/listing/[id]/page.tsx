import Head from "next/head";
import { ListingView } from "../../../views";

const ListingIdPage = () => {
  return (
    <div>
      <Head>
        <title>Listing</title>
        <meta name="description" content="Listing Details" />
      </Head>
      <ListingView />
    </div>
  );
};

export default ListingIdPage;
