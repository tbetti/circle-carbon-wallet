# 📚 API Routes Deep Dive - Beginner's Guide

## What is a "Route" File?

In Next.js, any `route.ts` file in the `src/app/api/` folder automatically becomes an API endpoint that your frontend can call.

**It's like having a mini-server built into your app!**

---

## Route #1: Get All Listings

### **File Location**
```
src/app/api/marketplace/listings/route.ts
```

### **What It Does**
When your app asks: "Give me all carbon projects", this route answers with mock data.

### **How to Call It**
```
GET http://localhost:3000/api/marketplace/listings
```

### **What It Returns** (Example)
```json
{
  "success": true,
  "data": {
    "listings": [
      {
        "listingId": "listing-001",
        "projectName": "Amazon Rainforest Conservation",
        "projectType": "Reforestation",
        "country": "Brazil",
        "vintage": "2024",
        "pricePerCredit": 15.50,
        "quantityAvailable": 5000,
        "description": "Protect and restore the Amazon rainforest"
      },
      ... (3 more projects)
    ],
    "total": 4,
    "timestamp": "2025-11-15T16:12:00.000Z"
  }
}
```

### **Code Breakdown**
```typescript
export async function GET(request: Request) {
  // This function runs when someone calls /api/marketplace/listings
  
  const mockListings = [
    // Array of 4 carbon projects
  ];
  
  // Return the data as JSON
  return Response.json({
    success: true,
    data: {
      listings: mockListings,
      total: mockListings.length,
      timestamp: new Date().toISOString(),
    },
  });
}
```

---

## Route #2: Get One Listing Details

### **File Location**
```
src/app/api/marketplace/listing/[id]/route.ts
```

### **What It Does**
When your app asks: "Give me details about project listing-001", this route answers with full details.

### **How to Call It**
```
GET http://localhost:3000/api/marketplace/listing/listing-001
GET http://localhost:3000/api/marketplace/listing/listing-002
```

The `[id]` in the filename means it accepts ANY ID, and you can get it from the URL.

### **What It Returns** (Example)
```json
{
  "success": true,
  "data": {
    "listingId": "listing-001",
    "projectName": "Amazon Rainforest Conservation",
    "projectType": "Reforestation",
    "country": "Brazil",
    "vintage": "2024",
    "pricePerCredit": 15.50,
    "quantityAvailable": 5000,
    "description": "Protect and restore the Amazon rainforest",
    "detailedDescription": "This project focuses on...",
    "certifications": ["Gold Standard", "VCS", "UNFCCC"],
    "sdgImpact": ["Climate Action", "Life on Land", "Partnerships"],
    "imageUrl": "https://via.placeholder.com/600x400?text=Amazon+Rainforest"
  }
}
```

### **Code Breakdown**
```typescript
export async function GET(
  request: Request,
  { params }: { params: { id: string } }  // Get the [id] from URL
) {
  const id = params.id;  // This will be "listing-001", etc
  
  const listingDetails = {
    "listing-001": { /* full data for Amazon */ },
    "listing-002": { /* full data for Solar */ },
    // etc...
  };
  
  const listing = listingDetails[id];
  
  // Return the specific listing
  return Response.json({
    success: true,
    data: listing,
  });
}
```

---

## Route #3: Calculate Carbon Emissions

### **File Location**
```
src/app/api/carbon/calculate/route.ts
```

### **What It Does**
When your app asks: "I drove 100 km in a car, how much CO2 did I make?", this route calculates it.

### **How to Call It**
This one uses POST (sending data TO the server):
```
POST http://localhost:3000/api/carbon/calculate
Content-Type: application/json

{
  "tripDistance": 100,
  "vehicleType": "car"
}
```

### **What It Returns**
```json
{
  "success": true,
  "data": {
    "totalEmissions": 21.0,
    "emissionsUnit": "kg CO2e",
    "costToOffset": 325.50,
    "currency": "USD",
    "vehicleType": "car",
    "tripDistance": 100,
    "calculationMethod": "Standard IPCC methodology",
    "timestamp": "2025-11-15T16:12:00.000Z"
  }
}
```

**Translation**: A 100 km car trip = 21 kg of CO2 = costs $325.50 to offset

### **Code Breakdown**
```typescript
export async function POST(request: Request) {
  // This function runs when someone POSTs to /api/carbon/calculate
  
  const body = await request.json();  // Get the data they sent
  const { tripDistance, vehicleType } = body;
  
  // Different vehicles have different emissions
  if (vehicleType === "car") emissionsFactor = 0.21;  // kg CO2 per km
  if (vehicleType === "bus") emissionsFactor = 0.05;  // much cleaner!
  
  // Calculate: distance × factor = total CO2
  const totalEmissions = tripDistance * emissionsFactor;
  
  // Calculate: CO2 × price per credit = cost
  const costToOffset = totalEmissions * 15.5;
  
  // Return the calculation
  return Response.json({
    success: true,
    data: {
      totalEmissions: parseFloat(totalEmissions.toFixed(2)),
      emissionsUnit: "kg CO2e",
      costToOffset: parseFloat(costToOffset.toFixed(2)),
      currency: "USD",
      vehicleType,
      tripDistance,
      calculationMethod: "Standard IPCC methodology",
      timestamp: new Date().toISOString(),
    },
  });
}
```

---

## How the Frontend Uses These Routes

### **In `src/lib/apiClient.ts`**

```typescript
// Before (trying to use external server):
const backendUrl = 'http://localhost:8000/api/'

// After (using local routes):
const backendUrl = '/api/'
```

### **In a React Component**

```typescript
// This is how a React component uses these APIs:

import { fetchMarketplaceListings } from '@/lib/apiClient';

export default function Marketplace() {
  const [listings, setListings] = useState(null);
  
  useEffect(() => {
    // Call the API
    fetchMarketplaceListings({})
      .then(result => {
        // Result contains our mock data!
        setListings(result.data.listings);
      })
      .catch(error => {
        console.error("Failed to fetch listings", error);
      });
  }, []);
  
  return (
    <div>
      {listings?.map(listing => (
        <div key={listing.listingId}>
          <h3>{listing.projectName}</h3>
          <p>Price: ${listing.pricePerCredit}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Vehicle Emission Factors (Used in Route #3)

Different vehicles pollute differently. Here's what we coded:

| Vehicle Type | Emissions (kg CO2/km) | Reason |
|--------------|----------------------|--------|
| Car | 0.21 | Standard gas car |
| Truck | 0.45 | Heavy, burns lots of fuel |
| Bus | 0.05 | Carries many people, per-person is low |
| Motorcycle | 0.11 | Small engine, efficient |
| Electric | 0.05 | Zero tailpipe emissions |

**Example Calculations:**
- 100 km by car = 100 × 0.21 = 21 kg CO2 = $325.50 to offset
- 100 km by bus = 100 × 0.05 = 5 kg CO2 = $77.50 to offset
- 100 km by electric = 100 × 0.05 = 5 kg CO2 = $77.50 to offset

---

## Error Handling

All three routes include error handling:

```typescript
try {
  // Do the work
  return Response.json({ success: true, data: ... });
} catch (error) {
  // If something goes wrong
  return Response.json(
    { success: false, error: "Failed to fetch listings" },
    { status: 500 }
  );
}
```

---

## Testing These Routes

### **From Browser (Easy Way)**
```
GET routes - just paste in your browser:
- http://localhost:3000/api/marketplace/listings
- http://localhost:3000/api/marketplace/listing/listing-001

POST routes - need curl or Postman:
See instructions below ↓
```

### **From Terminal (Curl)**
```bash
# Get all listings
curl http://localhost:3000/api/marketplace/listings

# Get one listing
curl http://localhost:3000/api/marketplace/listing/listing-001

# Calculate carbon (POST request)
curl -X POST http://localhost:3000/api/carbon/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "tripDistance": 100,
    "vehicleType": "car"
  }'
```

### **From Code (What Your App Does)**
```typescript
// Your app makes these calls automatically
const response = await fetch('/api/marketplace/listings');
const data = await response.json();
console.log(data);
```

---

## The Complete Data Flow

```
┌─────────────────────────────────────────────────────────┐
│  User's Browser                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Marketplace Page                                │  │
│  │  - Shows 4 carbon projects                       │  │
│  │  - Has a form to calculate emissions            │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────┬──────────────────────────────────────┘
                 │
         Makes HTTP Requests:
         • GET /api/marketplace/listings
         • GET /api/marketplace/listing/:id
         • POST /api/carbon/calculate
                 │
                 ↓
┌─────────────────────────────────────────────────────────┐
│  Next.js App (Running on localhost:3000)               │
│  ┌──────────────────────────────────────────────────┐  │
│  │  API Routes (src/app/api/*)                      │  │
│  │  ✓ /marketplace/listings                         │  │
│  │  ✓ /marketplace/listing/[id]                    │  │
│  │  ✓ /carbon/calculate                             │  │
│  └──────────────────────────────────────────────────┘  │
│                 Returns:                                 │
│         • Mock listings data                           │
│         • Listing details                              │
│         • CO2 calculations                             │
└────────────────┬──────────────────────────────────────┘
                 │
                 ↓
        Browser Shows Results
        (No external server needed!)
```

---

## Why This is Awesome for Beginners

1. **See Results Immediately**: Change code → refresh browser → see changes
2. **No Backend Setup**: Don't need to learn Node.js, databases, etc. (yet!)
3. **Understand the Full Flow**: You can see exactly how data moves
4. **Easy to Debug**: Everything is in your project, nothing hidden
5. **Perfect for Testing UI**: You can test your frontend without a backend

---

**You now understand how your mock APIs work! 🚀**

