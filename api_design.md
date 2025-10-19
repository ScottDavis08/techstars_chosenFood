# API Design - Foodback Loop
## Database Schema

### Tables Overview
All tables use Row Level Security (RLS) with policies for anonymous and authenticated users.

### `recipes`
Recipe storage with flexible ingredient and direction data.

```sql
CREATE TABLE recipes (
  id bigserial PRIMARY KEY,
  title text NOT NULL,
  ingredients jsonb NOT NULL DEFAULT '[]'::jsonb,  -- ["2 cups flour", "1 egg", ...]
  directions jsonb NOT NULL DEFAULT '[]'::jsonb,   -- ["Mix ingredients", "Bake at 350°F", ...]
  link text,                                       -- Source URL
  source text,                                     -- "Gathered/Recipes1M"
  image_url text,                                  -- Recipe image URL
  created_at timestamptz DEFAULT now()
);
```

### `inventory_items`
Current food bank inventory with quantities and sync status.

```sql
CREATE TABLE inventory_items (
  id bigserial PRIMARY KEY,
  item_id text NOT NULL,        -- External system identifier
  item_name text NOT NULL,      -- "Organic Bananas", "Whole Wheat Bread"
  quantity integer NOT NULL DEFAULT 0,
  last_synced timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
```

### `recipe_swipes`
User interaction tracking with match scoring.

```sql
CREATE TABLE recipe_swipes (
  id bigserial PRIMARY KEY,
  recipe_id bigint NOT NULL REFERENCES recipes(id),
  session_id uuid NOT NULL,     -- Anonymous session identifier
  action text NOT NULL CHECK (action IN ('like', 'dislike')),
  match_score decimal(5,2),     -- Percentage (0.00-100.00)
  created_at timestamptz DEFAULT now()
);
```

### `cart_recipes`
Selected recipes with serving adjustments.

```sql
CREATE TABLE cart_recipes (
  id bigserial PRIMARY KEY,
  session_id uuid NOT NULL,
  recipe_id bigint NOT NULL REFERENCES recipes(id),
  servings_multiplier decimal(5,2) NOT NULL DEFAULT 1.0,  -- 0.5 = half recipe, 2.0 = double
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## Planned Schema Extensions

### `user_preferences` (To be added)
```sql
CREATE TABLE user_preferences (
  session_id uuid PRIMARY KEY,
  household_size integer DEFAULT 1,
  dietary_restrictions jsonb DEFAULT '[]'::jsonb,  -- ["vegetarian", "gluten-free"]
  point_allocation integer DEFAULT 100,
  preferred_categories jsonb DEFAULT '[]'::jsonb,  -- ["produce", "dairy"]
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### `categories` (To be added)
```sql
CREATE TABLE categories (
  id bigserial PRIMARY KEY,
  name text NOT NULL UNIQUE,    -- "Produce", "Dairy", "Protein"
  description text,
  point_multiplier decimal(3,2) DEFAULT 1.0,
  created_at timestamptz DEFAULT now()
);
```

## API Endpoints (Supabase Auto-Generated)

### Recipes
```typescript
// Get all recipes
GET /rest/v1/recipes

// Get recipe with ingredients matching inventory
GET /rest/v1/recipes?select=*&ingredients=cs.["flour","eggs"]

// Get single recipe
GET /rest/v1/recipes?id=eq.123
```

### Inventory
```typescript
// Get all available items
GET /rest/v1/inventory_items?quantity=gt.0

// Get items by category (future)
GET /rest/v1/inventory_items?category=eq.produce

// Search items by name
GET /rest/v1/inventory_items?item_name=ilike.*chicken*
```

### User Actions
```typescript
// Record recipe swipe
POST /rest/v1/recipe_swipes
{
  "recipe_id": 123,
  "session_id": "uuid-here",
  "action": "like",
  "match_score": 85.50
}

// Add recipe to cart
POST /rest/v1/cart_recipes
{
  "session_id": "uuid-here",
  "recipe_id": 123,
  "servings_multiplier": 1.5
}

// Update cart recipe servings
PATCH /rest/v1/cart_recipes?id=eq.456
{
  "servings_multiplier": 2.0,
  "updated_at": "2024-01-18T10:00:00Z"
}

// Get user's cart
GET /rest/v1/cart_recipes?session_id=eq.uuid-here&select=*,recipes(*)
```

## Data Flow

### Recipe Matching Process
1. Fetch user preferences (session-based)
2. Get available inventory items
3. Query recipes with matching ingredients
4. Calculate match scores based on ingredient availability
5. Filter by dietary restrictions and preferences
6. Return scored and sorted recipe list

### Cart Management
1. User likes recipe → Create `recipe_swipes` record
2. Add to cart → Create `cart_recipes` record
3. User adjusts servings → Update `servings_multiplier`
4. Checkout → Export cart data to external system

### Points System (Future)
1. Each inventory item has point value
2. User has allocated points based on household size
3. Cart validation ensures total doesn't exceed allocation
4. Point calculations updated in real-time

## Response Formats

### Recipe with Match Score
```json
{
  "id": 123,
  "title": "Simple Pancakes",
  "ingredients": ["2 cups flour", "2 eggs", "1 cup milk"],
  "directions": ["Mix dry ingredients", "Add wet ingredients", "Cook on griddle"],
  "image_url": "https://example.com/pancakes.jpg",
  "match_score": 85.50,
  "available_ingredients": ["flour", "eggs"],
  "missing_ingredients": ["milk"]
}
```

### Cart Export Format
```json
{
  "items": [
    {
      "external_id": "item_123",
      "name": "Whole Wheat Flour",
      "quantity": 2,
      "source": "recipe_ingredient"
    }
  ],
  "recipes": [
    {
      "id": 123,
      "title": "Simple Pancakes",
      "servings": 1.5
    }
  ],
  "total_points": 85,
  "session_id": "uuid-here",
  "timestamp": "2024-01-18T10:00:00Z"
}
```

## Error Handling
- Standard HTTP status codes
- Supabase error format consistency
- Client-side validation before API calls
- Optimistic updates with rollback on failure