# Rental Type Feature

## Overview
Added a rental type option to property creation that allows landlords to specify whether their property is available for rental, lease, or both. This information is displayed across the application and can be used for filtering.

## Changes Made

### Backend Changes

#### 1. Property Model Update (`backend/models/Property.js`)
- Added `rentalType` field with enum values: ["Rental", "Lease", "Both"]
- Default value set to "Rental"
- Required field for all properties

#### 2. Landlord Properties API (`backend/routes/landlordProperties.js`)
- Updated property creation endpoint to accept `rentalType` parameter
- Added `rentalType` to property creation logic with default fallback

#### 3. Tenant Properties API (`backend/routes/properties.js`)
- Updated property transformation to include `rentalType` in responses
- Added `rentalType` to mock data for demo purposes
- Updated both list and single property endpoints

### Frontend Changes

#### 1. Landlord Properties Page (`frontend/src/pages/landlord/PropertiesPage.jsx`)
- Added `rentalType` to form state with default value "Rental"
- Added rental type selection field in property creation/editing form
- Updated `handleOpen` function to handle `rentalType` for both create and edit modes
- Added rental type display in property cards

#### 2. Tenant Properties Page (`frontend/src/pages/tenant/PropertiesPage.jsx`)
- Added `rentalType` filter state and UI component
- Updated filter grid layout from 3 columns to 4 columns (md={3})
- Added rental type filtering logic in `filterProperties` function
- Added rental type display in property cards
- Updated useEffect dependencies to include rental type filter

## Feature Details

### Rental Type Options
1. **Rental** - Property available for short-term rental agreements
2. **Lease** - Property available for long-term lease agreements
3. **Both** - Property available for both rental and lease arrangements

### UI Implementation

#### Landlord Side
- **Form Field**: Dropdown selection in property creation/editing form
- **Display**: Shows rental type in property cards alongside pricing information
- **Validation**: Required field with default value

#### Tenant Side
- **Filter**: Additional filter option in the properties search interface
- **Display**: Shows rental type in property cards for easy identification
- **Logic**: Properties marked as "Both" appear in all rental type filter results

### Filtering Logic
- When "Rental" is selected: Shows properties with rentalType = "Rental" OR "Both"
- When "Lease" is selected: Shows properties with rentalType = "Lease" OR "Both"
- When "Both" is selected: Shows only properties explicitly marked as "Both"
- When no filter is selected: Shows all properties regardless of rental type

## Database Schema
```javascript
rentalType: {
  type: String,
  enum: ["Rental", "Lease", "Both"],
  default: "Rental",
  required: true
}
```

## API Response Format
Properties now include the `rentalType` field in all API responses:
```javascript
{
  id: "...",
  title: "Property Title",
  // ... other fields
  rentalType: "Both",
  // ... rest of property data
}
```

## Benefits
1. **Clear Communication**: Landlords can specify their preferred rental arrangement
2. **Better Filtering**: Tenants can filter properties based on their preferred rental type
3. **Flexibility**: "Both" option allows maximum visibility for properties
4. **User Experience**: Clear indication of rental terms upfront

This feature enhances the property management system by providing clarity on rental arrangements and improving the search experience for tenants looking for specific types of rental agreements.