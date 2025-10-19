/*
  # Foodback Loop - Initial Schema

  ## Overview
  Database schema for matching food bank inventory with recipes and managing user recipe selections.

  ## New Tables

  ### `recipes`
  Stores recipe information with ingredients and cooking instructions
  - `id` (bigserial, primary key): Unique recipe identifier
  - `title` (text): Recipe name
  - `ingredients` (jsonb): Array of ingredient strings
  - `directions` (jsonb): Array of instruction steps
  - `link` (text): Source URL
  - `source` (text): Origin (Gathered/Recipes1M)
  - `image_url` (text): Recipe image for display
  - `created_at` (timestamptz): Record creation timestamp

  ### `inventory_items`
  Tracks current food bank inventory
  - `id` (bigserial, primary key): Unique inventory ID
  - `item_id` (text): External system item identifier
  - `item_name` (text): Standardized item name
  - `quantity` (integer): Available quantity
  - `last_synced` (timestamptz): Last sync with food bank API
  - `created_at` (timestamptz): Record creation timestamp

  ### `recipe_swipes`
  Records user swipe actions (like/dislike)
  - `id` (bigserial, primary key): Unique swipe record
  - `recipe_id` (bigint): Reference to recipes table
  - `session_id` (uuid): User session identifier
  - `action` (text): 'like' or 'dislike'
  - `match_score` (decimal): Percentage of ingredients available
  - `created_at` (timestamptz): Swipe timestamp

  ### `cart_recipes`
  Stores liked recipes added to cart with serving adjustments
  - `id` (bigserial, primary key): Unique cart item
  - `session_id` (uuid): User session identifier
  - `recipe_id` (bigint): Reference to recipes table
  - `servings_multiplier` (decimal): Quantity adjustment (1.0 = original)
  - `created_at` (timestamptz): Added to cart timestamp
  - `updated_at` (timestamptz): Last modification timestamp

  ## Security
  - Enable RLS on all tables
  - Allow public read access to recipes and inventory (food bank context)
  - Allow anonymous users to manage their session-based swipes and cart

  ## Notes
  - Session-based approach (no user accounts needed for MVP)
  - JSONB used for flexible ingredient/direction storage
  - Match scores help users understand ingredient availability
*/

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id bigserial PRIMARY KEY,
  title text NOT NULL,
  ingredients jsonb NOT NULL DEFAULT '[]'::jsonb,
  directions jsonb NOT NULL DEFAULT '[]'::jsonb,
  link text,
  source text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create inventory items table
CREATE TABLE IF NOT EXISTS inventory_items (
  id bigserial PRIMARY KEY,
  item_id text NOT NULL,
  item_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  last_synced timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create recipe swipes table
CREATE TABLE IF NOT EXISTS recipe_swipes (
  id bigserial PRIMARY KEY,
  recipe_id bigint NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  session_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('like', 'dislike')),
  match_score decimal(5,2),
  created_at timestamptz DEFAULT now()
);

-- Create cart recipes table
CREATE TABLE IF NOT EXISTS cart_recipes (
  id bigserial PRIMARY KEY,
  session_id uuid NOT NULL,
  recipe_id bigint NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  servings_multiplier decimal(5,2) NOT NULL DEFAULT 1.0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_recipes_title ON recipes(title);
CREATE INDEX IF NOT EXISTS idx_inventory_item_name ON inventory_items(item_name);
CREATE INDEX IF NOT EXISTS idx_recipe_swipes_session ON recipe_swipes(session_id);
CREATE INDEX IF NOT EXISTS idx_recipe_swipes_recipe ON recipe_swipes(recipe_id);
CREATE INDEX IF NOT EXISTS idx_cart_recipes_session ON cart_recipes(session_id);

-- Enable Row Level Security
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_recipes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recipes (public read)
CREATE POLICY "Anyone can view recipes"
  ON recipes FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for inventory_items (public read)
CREATE POLICY "Anyone can view inventory"
  ON inventory_items FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for recipe_swipes (session-based)
CREATE POLICY "Users can view own swipes"
  ON recipe_swipes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can create swipes"
  ON recipe_swipes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- RLS Policies for cart_recipes (session-based)
CREATE POLICY "Users can view cart items"
  ON cart_recipes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can create cart items"
  ON cart_recipes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update cart items"
  ON cart_recipes FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete cart items"
  ON cart_recipes FOR DELETE
  TO anon, authenticated
  USING (true);


  -- Add cart_items table for individual inventory items
CREATE TABLE IF NOT EXISTS cart_items (
  id bigserial PRIMARY KEY,
  session_id uuid NOT NULL,
  inventory_item_id bigint NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cart_items_session ON cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_inventory ON cart_items(inventory_item_id);

-- Enable Row Level Security
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cart_items (session-based)
CREATE POLICY "Anyone can view cart items"
  ON cart_items FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create cart items"
  ON cart_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update cart items"
  ON cart_items FOR UPDATE
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can delete cart items"
  ON cart_items FOR DELETE
  TO anon, authenticated
  USING (true);
  