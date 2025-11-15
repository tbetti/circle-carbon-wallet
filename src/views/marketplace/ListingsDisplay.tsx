import { Button } from '../../components/ui/button'
import Link from 'next/link';

export const ListingsDisplay = ({ listings }: { listings: Record<string, unknown>[] }) => {
  const displayData = listings || [];

  return (
    <div className="text-left text-white max-h-96 overflow-y-auto">
      {displayData.length > 0 ? (
        displayData.map((item) => (
          <div key={String(item.listingId)} className="p-4 border-b border-gray-600">
            <h4 className="font-bold text-lg">🌳 {String(item.projectName)}</h4>
            <p className="text-sm text-gray-300">
              {String(item.projectType)} • {String(item.country)} • {String(item.vintage)} Vintage
            </p>
            <div className="flex justify-between items-center mt-2">
              <span className="font-bold text-green-400">
                💰 {parseFloat(String(item.pricePerCredit)).toFixed(2)} USDC per credit
              </span>
              <span className="text-gray-400">
                📦 {String(item.quantityAvailable)} available
              </span>
              <Link href={`/listing/${String(item.listingId)}`}>
                <Button className="w-full bg-[#00A884] hover:bg-[#00A884]/90 text-white rounded-2xl h-12">
                  Purchase
                </Button>
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p>No listings found.</p>
      )}
    </div>
  );
};