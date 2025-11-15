/**
 * Mock API endpoint for carbon emissions calculation
 * Route: POST /api/carbon/calculate
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tripDistance, vehicleType, gpuType, region } = body;

    // Mock calculation logic
    let emissionsFactor = 0.21; // kg CO2 per km (default: car)

    if (vehicleType === "car") emissionsFactor = 0.21;
    else if (vehicleType === "truck") emissionsFactor = 0.45;
    else if (vehicleType === "bus") emissionsFactor = 0.05;
    else if (vehicleType === "motorcycle") emissionsFactor = 0.11;
    else if (vehicleType === "electric") emissionsFactor = 0.05;

    const totalEmissions = (tripDistance || 0) * emissionsFactor;
    const costToOffset =
      totalEmissions * 15.5; // Using average carbon credit price of $15.50

    return Response.json({
      success: true,
      data: {
        totalEmissions: parseFloat(totalEmissions.toFixed(2)),
        emissionsUnit: "kg CO2e",
        costToOffset: parseFloat(costToOffset.toFixed(2)),
        currency: "USD",
        vehicleType: vehicleType || "car",
        tripDistance: tripDistance || 0,
        calculationMethod: "Standard IPCC methodology",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    return Response.json(
      { success: false, error: "Failed to calculate emissions" },
      { status: 500 }
    );
  }
}
