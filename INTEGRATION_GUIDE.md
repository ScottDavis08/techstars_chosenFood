# Foodback Loop - Integration Guide

## Overview

This application matches food bank inventory with recipes, providing a Tinder-style swipeable interface for recipe selection and a cart system for ingredient management.

## Quick Start

### 1. Seed Sample Data

To test the application, you'll need to add recipes and inventory to the database.

#### Import Recipes

Use the POST endpoint `/api/recipes/import` with your recipe data:

```bash
curl -X POST http://localhost:3000/api/recipes/import \
  -H "Content-Type: application/json" \
  -d '[
    {
      "title": "Tomato Pasta",
      "ingredients": ["pasta", "tomatoes", "garlic", "olive oil"],
      "directions": ["Boil pasta", "Make sauce", "Combine"],
      "link": "https://example.com/recipe",
      "source": "Gathered",
      "image_url": null
    }
  ]'
```

#### Sync Inventory

Use the POST endpoint `/api/inventory/sync` with food bank inventory:

```bash
curl -X POST http://localhost:3000/api/inventory/sync \
  -H "Content-Type: application/json" \
  -d '[
    {
      "item_id": "001",
      "item_name": "pasta",
      "quantity": 50
    },
    {
      "item_id": "002",
      "item_name": "tomatoes",
      "quantity": 30
    }
  ]'
```

### 2. Application Features

#### Recipe Swiper
- Displays recipes matched to available inventory
- Adjustable tolerance slider (0-100%)
- Swipe right (or click heart) to add to cart
- Swipe left (or click X) to pass
- Visual indicators show available vs. missing ingredients

#### Cart Management
- View all liked recipes
- Adjust serving sizes (0.5x increments)
- Remove recipes from cart
- Export ingredients to external cart system

### 3. External Cart Integration

The application exports cart data in a standardized format for integration with existing food bank systems.

#### Export Format

```javascript
{
  items: [
    {
      item_id: "recipe_123_ingredient_0",
      item_name: "pasta",
      quantity: 1,
      metadata: {
        recipe_id: 123,
        recipe_title: "Tomato Pasta",
        servings_multiplier: 1.0
      }
    }
  ],
  source: "recipe_matcher",
  timestamp: "2025-10-18T12:00:00.000Z"
}
```

#### Integration Steps

1. **Receive Export Data**: When users click "Export to Cart", the application calls the `onExport` handler with formatted data
2. **Convert Format**: Use `convertToExternalCartFormat()` from `lib/cart-adapter.ts` to transform the data
3. **Send to External API**: Call your existing cart system API with the formatted data

Example integration in `app/page.tsx`:

```typescript
const handleExport = async (exportData: ExportData) => {
  const cartItems = convertToExternalCartFormat(exportData);

  // Send to your external cart API
  await fetch('YOUR_CART_API_URL', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: cartItems,
      source: 'recipe_matcher',
      timestamp: new Date().toISOString(),
    }),
  });
};
```

## Database Schema

### Tables

- **recipes**: Stores recipe information
- **inventory_items**: Current food bank inventory
- **recipe_swipes**: User interaction history
- **cart_recipes**: Selected recipes with serving adjustments

### Session Management

The application uses browser localStorage for session-based tracking (no user accounts required for MVP). Each session gets a UUID stored in `foodbank_session_id`.

## API Endpoints

### POST `/api/recipes/import`
Import recipes into the database from your recipe dataset.

### POST `/api/inventory/sync`
Sync inventory from food bank external API. This replaces all existing inventory.

### GET `/api/inventory/sync`
Retrieve current inventory items.

## Matching Algorithm

The recipe matcher (`lib/recipe-matcher.ts`) uses intelligent ingredient matching:

1. Normalizes ingredient names (removes quantities, common words)
2. Performs fuzzy matching between recipe ingredients and inventory
3. Calculates match scores (% of ingredients available)
4. Filters recipes by configurable tolerance level
5. Sorts by best matches first

## Customization

### Tolerance Levels

Adjust the default tolerance in `components/swipe-interface.tsx`:

```typescript
const [tolerance, setTolerance] = useState(70); // Default 70%
```

### Recipe Images

Add image URLs when importing recipes, or use placeholder emoji if null.

### Styling

The application uses Tailwind CSS with shadcn/ui components. Customize in:
- `app/globals.css` for global styles
- Component files for specific styling

## Production Considerations

1. **External API Integration**: Replace mock inventory sync with real food bank API
2. **Image Hosting**: Store recipe images in a CDN or cloud storage
3. **Authentication**: Add user accounts if needed for personalization
4. **Caching**: Implement caching for inventory and recipe matching
5. **Error Handling**: Add comprehensive error boundaries and user feedback
6. **Analytics**: Track recipe popularity and matching effectiveness

## Support

For questions about integration, refer to:
- `lib/cart-adapter.ts` - External cart format conversion
- `lib/recipe-matcher.ts` - Matching algorithm logic
- `lib/supabase.ts` - Database types and client
