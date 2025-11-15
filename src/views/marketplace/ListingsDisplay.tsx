import { Button } from '../../components/ui/button'
import Link from 'next/link';

export const ListingsDisplay = ({ listings }: { listings: Record<string, unknown>[] }) => {
  const displayData = listings || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayData.length > 0 ? (
        displayData.map((item) => (
          <div 
            key={String(item.listingId)} 
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden flex flex-col"
          >
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-100">
              <h4 className="font-bold text-lg text-gray-800">{String(item.projectName)}</h4>
              <p className="text-sm text-gray-600 mt-2">
                {String(item.projectType)} • {String(item.country)} • {String(item.vintage)} Vintage
              </p>
            </div>
            
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Price per Credit</span>
                  <span className="font-bold text-green-600 text-lg">
                    {parseFloat(String(item.pricePerCredit)).toFixed(2)} USDC
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Available Credits</span>
                  <span className="font-bold text-gray-800">
                    {String(item.quantityAvailable)}
                  </span>
                </div>
              </div>
              
              <Link href={`/listing/${String(item.listingId)}`} className="block w-full">
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg h-10 font-semibold transition-all">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full flex items-center justify-center py-12">
          <p className="text-gray-500 text-lg">No carbon credits available yet.</p>
        </div>
      )}
    </div>
  );
};