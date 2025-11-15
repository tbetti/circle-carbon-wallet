/**
 * Mock API endpoint for marketplace listings
 * This is a Next.js API route that acts as the backend
 * Route: GET /api/marketplace/listings
 */

export async function GET(request: Request) {
  try {
    // Mock listings data
    const mockListings = [
      {
        listingId: "listing-001",
        projectName: "Amazon Rainforest Conservation",
        projectType: "Reforestation",
        country: "Brazil",
        vintage: "2024",
        pricePerCredit: 15.50,
        quantityAvailable: 5000,
        description: "Protect and restore the Amazon rainforest",
      },
      {
        listingId: "listing-002",
        projectName: "Solar Farm Initiative",
        projectType: "Renewable Energy",
        country: "India",
        vintage: "2024",
        pricePerCredit: 12.75,
        quantityAvailable: 10000,
        description: "Large-scale solar energy production",
      },
      {
        listingId: "listing-003",
        projectName: "Mangrove Restoration",
        projectType: "Coastal Protection",
        country: "Indonesia",
        vintage: "2023",
        pricePerCredit: 18.00,
        quantityAvailable: 3000,
        description: "Restore coastal mangrove ecosystems",
      },
      {
        listingId: "listing-004",
        projectName: "Wind Energy Park",
        projectType: "Renewable Energy",
        country: "Portugal",
        vintage: "2024",
        pricePerCredit: 14.25,
        quantityAvailable: 7500,
        description: "Offshore wind energy production",
      },
    ];

    // Return mock data
    return Response.json({
      success: true,
      data: {
        listings: mockListings,
        total: mockListings.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}
