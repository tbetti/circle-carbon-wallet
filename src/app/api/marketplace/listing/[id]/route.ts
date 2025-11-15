/**
 * Mock API endpoint for individual listing details
 * Route: GET /api/marketplace/listing/[id]
 */

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Mock listing details
    const listingDetails: Record<string, any> = {
      "listing-001": {
        listingId: "listing-001",
        projectName: "Amazon Rainforest Conservation",
        projectType: "Reforestation",
        country: "Brazil",
        vintage: "2024",
        pricePerCredit: 15.50,
        quantityAvailable: 5000,
        description: "Protect and restore the Amazon rainforest",
        detailedDescription:
          "This project focuses on protecting pristine Amazon rainforest while restoring degraded areas. Each carbon credit represents 1 tonne of CO2 equivalent prevented from entering the atmosphere.",
        certifications: ["Gold Standard", "VCS", "UNFCCC"],
        sdgImpact: ["Climate Action", "Life on Land", "Partnerships"],
        imageUrl: "https://via.placeholder.com/600x400?text=Amazon+Rainforest",
      },
      "listing-002": {
        listingId: "listing-002",
        projectName: "Solar Farm Initiative",
        projectType: "Renewable Energy",
        country: "India",
        vintage: "2024",
        pricePerCredit: 12.75,
        quantityAvailable: 10000,
        description: "Large-scale solar energy production",
        detailedDescription:
          "A utility-scale solar farm displacing fossil fuel-based electricity. Credits represent verified renewable energy generation.",
        certifications: ["Gold Standard", "ISO 14064"],
        sdgImpact: ["Affordable and Clean Energy", "Climate Action"],
        imageUrl: "https://via.placeholder.com/600x400?text=Solar+Farm",
      },
      "listing-003": {
        listingId: "listing-003",
        projectName: "Mangrove Restoration",
        projectType: "Coastal Protection",
        country: "Indonesia",
        vintage: "2023",
        pricePerCredit: 18.00,
        quantityAvailable: 3000,
        description: "Restore coastal mangrove ecosystems",
        detailedDescription:
          "Mangrove restoration protects coastlines while sequestering carbon. These ecosystems are highly effective carbon sinks.",
        certifications: ["VCS", "Verified Carbon Standard"],
        sdgImpact: ["Climate Action", "Life Below Water", "Life on Land"],
        imageUrl: "https://via.placeholder.com/600x400?text=Mangrove",
      },
      "listing-004": {
        listingId: "listing-004",
        projectName: "Wind Energy Park",
        projectType: "Renewable Energy",
        country: "Portugal",
        vintage: "2024",
        pricePerCredit: 14.25,
        quantityAvailable: 7500,
        description: "Offshore wind energy production",
        detailedDescription:
          "Offshore wind farm generating clean electricity. Each credit represents verified renewable energy displacement.",
        certifications: ["Gold Standard", "CDM"],
        sdgImpact: ["Affordable and Clean Energy", "Climate Action"],
        imageUrl: "https://via.placeholder.com/600x400?text=Wind+Park",
      },
    };

    const listing = listingDetails[id];

    if (!listing) {
      return Response.json(
        { success: false, error: "Listing not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: listing,
    });
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to fetch listing details" },
      { status: 500 }
    );
  }
}
