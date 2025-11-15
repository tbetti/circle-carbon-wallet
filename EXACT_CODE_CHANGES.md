# 🔧 Exact Code Changes - Line by Line

This document shows EXACTLY what code was added and changed.

---

## Change #1: Modified `src/lib/apiClient.ts`

### **What Line Changed**
Line 13-14

### **Before** ❌
```typescript
// ⚠️ IMPORTANT: Configure your backend URL in .env.local
// Set NEXT_PUBLIC_BACKEND_URL=<your_backend_url> or ensure backend is running on localhost:8000
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api/';
```

### **After** ✅
```typescript
// ⚠️ IMPORTANT: Using local Next.js API routes (src/app/api/*)
// These are mock endpoints for marketplace and carbon calculation testing
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '/api/';
```

### **Why?**
- **Before**: Tried to connect to external server at `http://localhost:8000` (which doesn't exist)
- **After**: Uses `/api/` which points to the local routes we created

### **Effect**
Every API call in your app now uses the mock routes instead of trying to reach a non-existent server.

---

## Change #2: Created New File - Listings API

### **File Path**
```
src/app/api/marketplace/listings/route.ts
```

### **File Content**
```typescript
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
```

### **What It Does**
- **URL**: `/api/marketplace/listings`
- **Method**: GET (just read data, don't send anything)
- **Returns**: JSON with 4 carbon projects
- **No Database**: Data is hardcoded right in the file

---

## Change #3: Created New File - Listing Details API

### **File Path**
```
src/app/api/marketplace/listing/[id]/route.ts
```

### **File Content**
```typescript
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
```

### **What It Does**
- **URL**: `/api/marketplace/listing/listing-001` (the ID changes)
- **Method**: GET
- **Returns**: Full details of ONE project
- **Lookup**: Takes the ID from the URL and returns matching data

---

## Change #4: Created New File - Carbon Calculation API

### **File Path**
```
src/app/api/carbon/calculate/route.ts
```

### **File Content**
```typescript
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
```

### **What It Does**
- **URL**: `/api/carbon/calculate`
- **Method**: POST (sending data TO the server)
- **Takes**: tripDistance + vehicleType
- **Returns**: CO2 emissions + cost to offset
- **Calculation**: `distance × vehicle factor = total CO2`

---

## Summary Table

| Item | Status | Location |
|------|--------|----------|
| Listings API | ✅ NEW | `src/app/api/marketplace/listings/route.ts` |
| Listing Details API | ✅ NEW | `src/app/api/marketplace/listing/[id]/route.ts` |
| Carbon Calc API | ✅ NEW | `src/app/api/carbon/calculate/route.ts` |
| API Client Update | ✅ MODIFIED | `src/lib/apiClient.ts` (1 line changed) |

---

## How These Files Work Together

```
Your App (src/views/marketplace/index.tsx)
        ↓
Calls: fetchMarketplaceListings()
        ↓
Makes: GET /api/marketplace/listings
        ↓
Goes to: src/app/api/marketplace/listings/route.ts
        ↓
Returns: 4 mock projects
        ↓
Displays on page!
```

---

## Testing Each Change

### **Test 1: Check the API Response**
```bash
# Open in browser
http://localhost:3000/api/marketplace/listings

# Should show JSON with 4 projects
```

### **Test 2: Check Details API**
```bash
# Open in browser
http://localhost:3000/api/marketplace/listing/listing-001

# Should show full details of Amazon project
```

### **Test 3: Check Calculation API**
```bash
# From terminal (curl)
curl -X POST http://localhost:3000/api/carbon/calculate \
  -H "Content-Type: application/json" \
  -d '{"tripDistance": 100, "vehicleType": "car"}'

# Should return: 21 kg CO2 = $325.50 to offset
```

### **Test 4: Check Frontend**
```bash
# Open in browser
http://localhost:3000/marketplace

# Should display the 4 projects from our mock API
# No errors in console!
```

---

## Key Concepts Explained

### **What is `export async function GET`?**
This means: "When someone makes a GET request to this route, run this function"

### **What is `{ params }`?**
This gets variables from the URL. In `/api/marketplace/listing/[id]`, the `[id]` becomes available as `params.id`

### **What is `Response.json()`?**
This sends data back to the browser as JSON (structured data)

### **What is `try...catch`?**
This handles errors. If something goes wrong, we return an error message instead of crashing

---

## One More Thing: How URLs Map to Files

```
URL Path                                 → File Location
/api/marketplace/listings                → src/app/api/marketplace/listings/route.ts
/api/marketplace/listing/listing-001     → src/app/api/marketplace/listing/[id]/route.ts
/api/marketplace/listing/listing-002     → src/app/api/marketplace/listing/[id]/route.ts
/api/carbon/calculate                    → src/app/api/carbon/calculate/route.ts

The [id] part is dynamic - it can be any value!
```

---

**You now understand EXACTLY what changed and why! 🎉**

