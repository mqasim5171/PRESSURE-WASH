# Arcturus Services - API Contracts & Integration Plan

## Overview
This document outlines the API contracts, data structure, and backend integration plan for the Arcturus Services cleaning website.

## Current Mock Data Structure

### 1. Services Data
**Location:** `/frontend/src/mock/mockData.js`
**Structure:**
- Service ID, slug, title, description, price, duration, includes array
- Used in: Services section, service detail pages, contact form dropdown

### 2. Quote Requests
**Structure:**
```json
{
  "id": "string",
  "name": "string", 
  "email": "string",
  "phone": "string", 
  "suburb": "string",
  "service": "string",
  "propertyType": "string",
  "contactPreference": "string", 
  "message": "string",
  "status": "new|contacted|quoted|completed",
  "createdAt": "timestamp"
}
```

### 3. Testimonials
**Structure:**
- Customer name, location, rating, service, text, date
- Used in: Testimonials section, homepage social proof

## API Endpoints to Implement

### 1. POST /api/quotes
**Purpose:** Submit contact form / quote request
**Request Body:** Quote request object
**Response:** Success message + quote ID
**Integration:** Replace mock submission in Contact.jsx

### 2. GET /api/services
**Purpose:** Fetch all services 
**Response:** Array of service objects
**Integration:** Replace copy.services in Services.jsx

### 3. GET /api/services/:slug
**Purpose:** Get individual service details
**Response:** Single service object
**Integration:** ServiceDetail.jsx

### 4. GET /api/testimonials
**Purpose:** Fetch customer testimonials
**Response:** Array of testimonial objects
**Integration:** Testimonials.jsx

## Frontend Integration Points

### Files to Update:
1. **Contact.jsx** - Replace mock form submission with API call
2. **Services.jsx** - Fetch services from API instead of copy.js
3. **ServiceDetail.jsx** - Fetch service data by slug
4. **Testimonials.jsx** - Load testimonials from API
5. **mockData.js** - Remove after backend integration

### Data Validation:
- Email format validation
- Phone number format (Australian)
- Required field validation
- Suburb validation against service areas

## Database Schema

### Collections:
1. **quotes** - Store quote requests
2. **services** - Service information (if admin needs to modify)
3. **testimonials** - Customer reviews
4. **service_areas** - Supported suburbs/regions

## Integration Steps:
1. Create MongoDB models for quotes, services, testimonials
2. Implement API endpoints with validation
3. Update frontend components to use real APIs
4. Test form submissions and data display
5. Add admin interface (optional)

## Mock Data Status:
✅ Contact form - Mock submission working, ready for API
✅ Services display - Static data in copy.js, ready for API  
✅ Gallery images - Static URLs, no backend needed
✅ Navigation - All routes working
✅ Testimonials - Static data, ready for API

The frontend is complete and fully functional with mock data. Backend integration will replace mock responses with real database operations.