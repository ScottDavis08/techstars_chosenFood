import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Recipe = {
  id: number;
  title: string;
  ingredients: string[];
  directions: string[];
  link?: string;
  source?: string;
  image_url?: string;
  created_at?: string;
};

export type InventoryItem = {
  id: number;
  item_id: string;
  item_name: string;
  quantity: number;
  last_synced?: string;
};

export type RecipeSwipe = {
  id: number;
  recipe_id: number;
  session_id: string;
  action: 'like' | 'dislike';
  match_score?: number;
  created_at?: string;
};

export type CartRecipe = {
  id: number;
  session_id: string;
  recipe_id: number;
  servings_multiplier: number;
  created_at?: string;
  updated_at?: string;
  recipe?: Recipe;
};
