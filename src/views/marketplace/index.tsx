"use client";

import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
// Make sure this import path is correct for your project structure
import { fetchMarketplaceListings } from '../../lib/apiClient';
import pkg from '../../../package.json'; // Adjust path as needed
import { ListingsDisplay } from './ListingsDisplay';

export const MarketPlaceView: FC = ({}) => {
  const [listings, setListings] = useState<Record<string, unknown>[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // This useEffect runs once when the component mounts
  useEffect(() => {
    // Define an async function inside useEffect
    const loadListings = async () => {
      try {
        setLoading(true);
        setError(null);

        // Call the API function with all nulls, as requested
        const result = await fetchMarketplaceListings({
          projectType: '',
          minPrice: 0,
          maxPrice: 10000000000,
          minQuantity: 0,
          sortBy: '',
          limit: 10,
        });
        setListings(result.data.listings || []);
      } catch (err) {
        console.error('Failed to fetch listings:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    // Call the function
    loadListings();
  }, []);

  // Helper function to render content based on state
  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-8">Loading listings...</div>;
    }

    if (error) {
      return (
        <div className="text-center">
          <p>Error loading listings:</p>
          <p>{error}</p>
        </div>
      );
    }

    return <ListingsDisplay listings={listings || []} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
            Carbon Credit Marketplace
          </h1>
          <p className="text-center text-base md:text-lg text-gray-600 mb-2">
            Offset the environmental impact of your cross-chain transfers
          </p>
          <p className="text-center text-xs md:text-sm text-gray-500">
            Every transfer has a carbon cost. Purchase verified credits to make your transfers climate-neutral.
          </p>
        </div>

        {/* How It Works Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="text-3xl mb-3 font-bold text-blue-600">1</div>
            <h3 className="font-bold text-gray-800 mb-2">Make a Transfer</h3>
            <p className="text-sm text-gray-600">Cross-chain USDC transfers calculate their carbon footprint automatically.</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="text-3xl mb-3 font-bold text-blue-600">2</div>
            <h3 className="font-bold text-gray-800 mb-2">Calculate Impact</h3>
            <p className="text-sm text-gray-600">We estimate CO2 emissions based on gas usage and blockchain activity.</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="text-3xl mb-3 font-bold text-blue-600">3</div>
            <h3 className="font-bold text-gray-800 mb-2">Offset Credits</h3>
            <p className="text-sm text-gray-600">Purchase verified carbon credits to neutralize your transfer's impact.</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          {/* Loading/Error/Success States */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading carbon credits...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700 font-semibold mb-2">Unable to load carbon credits</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Available Credits</h2>
                <p className="text-gray-600">
                  {listings && listings.length > 0 
                    ? `${listings.length} verified carbon offset projects available`
                    : 'No credits available at this time'}
                </p>
              </div>
              
              {/* Listings Grid */}
              <ListingsDisplay listings={listings || []} />
            </>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>v{pkg.version} • All credits verified by certified environmental organizations</p>
        </div>
      </div>
    </div>
  );
};

// Default export for the page
export default MarketPlaceView;