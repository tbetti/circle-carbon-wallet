# Mock API Implementation - Beginner's Guide

## What We're Trying to Fix

**The Problem:**
- Your marketplace page was showing "Failed to retrieve marketplace listing" error
- The app was trying to connect to a backend API at `localhost:8000`, but no backend server was running
- Without real data, users couldn't see marketplace listings or calculate carbon emissions

**The Root Cause:**
Your frontend (Next.js app) needs data to display. It was looking for that data from a backend server that didn't exist yet.

---

## What We Created (The Solution)

Instead of creating a separate backend server, we created **mock API endpoints** inside your Next.js app itself. Think of it like this:

- **Before**: Frontend → (tries to reach) → Backend Server (doesn't exist) ❌
- **After**: Frontend → Uses → Built-in Mock API Routes ✅

### New Files Created

#### 1. `/src/app/api/marketplace/listings/route.ts`
- **What it does**: Returns a list of carbon credit projects
- **URL**: `/api/marketplace/listings` 
- **Example data it returns**:
  ```
  - Amazon Rainforest Conservation (Brazil, $15.50/credit)
  - Solar Farm Initiative (India, $12.75/credit)
  - Mangrove Restoration (Indonesia, $18.00/credit)
  - Wind Energy Park (Portugal, $14.25/credit)
  ```

#### 2. `/src/app/api/marketplace/listing/[id]/route.ts`
- **What it does**: Returns detailed information about a single carbon project
- **URL**: `/api/marketplace/listing/listing-001` (for example)
- **Returns**: Full details including description, certifications, SDG impact, etc.

#### 3. `/src/app/api/carbon/calculate/route.ts`
- **What it does**: Calculates how much CO2 a trip produces
- **URL**: `/api/carbon/calculate`
- **How it works**: 
  - You tell it: vehicle type (car, truck, bus) + distance traveled
  - It calculates: total CO2 emissions + cost to offset

### File Modified

#### `/src/lib/apiClient.ts`
- **What changed**: Updated the backend URL from `http://localhost:8000/api/` to `/api/`
- **Why**: Now it uses the local mock routes instead of trying to reach an external server
- **Before**:
  ```typescript
  const backendUrl = 'http://localhost:8000/api/'
  ```
- **After**:
  ```typescript
  const backendUrl = '/api/'
  ```

---

## Current Error & Why It's Happening

**Error**: npm run dev failed in the wrong directory

**Why**: The terminal was in `/Users/aldofebrien/Desktop/Circle-Arc-Project/` (parent folder) instead of the actual project folder `/Users/aldofebrien/Desktop/Circle-Arc-Project/circle-carbon-wallet/`

**The fix**: We need to be in the `circle-carbon-wallet` folder when running npm commands

---

## Step-by-Step How These Mock APIs Work

### Example 1: Getting Marketplace Listings
1. User clicks on "Marketplace" page
2. React component runs: `fetchMarketplaceListings()`
3. This makes a request to `/api/marketplace/listings`
4. Next.js catches this request and runs `route.ts`
5. `route.ts` returns mock listing data (4 sample projects)
6. React displays this data on the page

### Example 2: Calculating Carbon Emissions
1. User enters trip distance and vehicle type in the form
2. React component sends data to `/api/carbon/calculate`
3. `route.ts` calculates: `distance × emission factor = total CO2`
4. Returns the result (e.g., "100 km × 0.21 = 21 kg CO2")
5. Shows the cost to offset (kg CO2 × $15.50 per ton)

---

## What Comes Next

1. **Start the dev server** (in the right folder)
2. **Visit /marketplace** - should now show 4 carbon projects
3. **Visit /emissions** - should calculate carbon from a trip
4. **Test the whole flow** - user can now interact with the app

---

## Branch Info

- **Branch**: `feature/mock-api-endpoints`
- **Status**: Ready to test
- **Master branch**: Untouched (safe from these changes)
- **When to merge**: After testing everything works

---

## Technical Breakdown (For Understanding)

### What is a "route.ts" file?
In Next.js 13+, any file named `route.ts` in the `src/app/api/` folder automatically becomes an API endpoint.

**File path** → **API URL**:
- `src/app/api/marketplace/listings/route.ts` → `GET /api/marketplace/listings`
- `src/app/api/marketplace/listing/[id]/route.ts` → `GET /api/marketplace/listing/123`
- `src/app/api/carbon/calculate/route.ts` → `POST /api/carbon/calculate`

### Why Mock Data?
- **No backend setup needed**: You can test the UI without a separate server
- **No database needed**: Data is hardcoded in the route files
- **Fast development**: Changes are instant (just refresh the page)
- **Easy to replace**: When you build a real backend, just change the URLs in `apiClient.ts`

---

## Summary of Changes

| File | What Changed | Why |
|------|-------------|-----|
| `src/app/api/marketplace/listings/route.ts` | NEW | Return list of projects |
| `src/app/api/marketplace/listing/[id]/route.ts` | NEW | Return project details |
| `src/app/api/carbon/calculate/route.ts` | NEW | Calculate CO2 emissions |
| `src/lib/apiClient.ts` | URL changed to `/api/` | Use local routes |

---

