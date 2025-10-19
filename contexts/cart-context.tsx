'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface CartItem {
  id: string;
  inventory_item_id: string;
  quantity: number;
  item_name: string;
  item_id: string;
  available_quantity: number;
}

interface CartRecipe {
  id: string;
  recipe_id: string;
  servings_multiplier: number;
  recipe: {
    id: string;
    title: string;
    ingredients: string[];
    directions: string[];
    image_url?: string;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  cartRecipes: CartRecipe[];
  sessionId: string;
  loading: boolean;
  error: string | null;
  
  // Item operations
  addItem: (inventoryItemId: string, quantity: number) => Promise<void>;
  updateItemQuantity: (cartItemId: string, newQuantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  
  // Recipe operations
  addRecipe: (recipeId: string, servingsMultiplier?: number) => Promise<void>;
  updateRecipeServings: (cartRecipeId: string, newMultiplier: number) => Promise<void>;
  removeRecipe: (cartRecipeId: string) => Promise<void>;
  
  // Utility functions
  getTotalItems: () => number;
  getTotalRecipes: () => number;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartRecipes, setCartRecipes] = useState<CartRecipe[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize session and load cart data
  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      // Get or create session ID
      let currentSessionId = localStorage.getItem('food_bank_session_id');
      if (!currentSessionId) {
        currentSessionId = crypto.randomUUID();
        localStorage.setItem('food_bank_session_id', currentSessionId);
      }
      setSessionId(currentSessionId);
      
      await loadCartData(currentSessionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize cart');
    } finally {
      setLoading(false);
    }
  };

  const loadCartData = async (sessionId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Load cart items with inventory details
      const { data: itemsData, error: itemsError } = await supabase
        .from('cart_items')
        .select(`
          id,
          inventory_item_id,
          quantity,
          inventory_items (
            item_name,
            item_id,
            quantity
          )
        `)
        .eq('session_id', sessionId);

      if (itemsError && itemsError.code !== 'PGRST116') {
        throw itemsError;
      }

      // Load cart recipes with recipe details
      const { data: recipesData, error: recipesError } = await supabase
        .from('cart_recipes')
        .select(`
          id,
          recipe_id,
          servings_multiplier,
          recipes (
            id,
            title,
            ingredients,
            directions,
            image_url
          )
        `)
        .eq('session_id', sessionId);

      if (recipesError) {
        throw recipesError;
      }

      // Transform items data
      const transformedItems: CartItem[] = (itemsData || []).map(item => ({
        id: item.id,
        inventory_item_id: item.inventory_item_id,
        quantity: item.quantity,
        item_name: item.inventory_items?.item_name || 'Unknown Item',
        item_id: item.inventory_items?.item_id || '',
        available_quantity: item.inventory_items?.quantity || 0
      }));

      // Transform recipes data
      const transformedRecipes: CartRecipe[] = (recipesData || []).map(recipe => ({
        id: recipe.id,
        recipe_id: recipe.recipe_id,
        servings_multiplier: recipe.servings_multiplier,
        recipe: {
          id: recipe.recipes?.id || '',
          title: recipe.recipes?.title || 'Unknown Recipe',
          ingredients: recipe.recipes?.ingredients || [],
          directions: recipe.recipes?.directions || [],
          image_url: recipe.recipes?.image_url
        }
      }));

      setCartItems(transformedItems);
      setCartRecipes(transformedRecipes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cart data');
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (inventoryItemId: string, quantity: number) => {
    if (!sessionId) throw new Error('No session available');

    try {
      // Check if item already exists in cart
      const existingItem = cartItems.find(item => item.inventory_item_id === inventoryItemId);

      if (existingItem) {
        // Update existing item quantity
        await updateItemQuantity(existingItem.id, existingItem.quantity + quantity);
        return;
      }

      // Add new item to database
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          session_id: sessionId,
          inventory_item_id: inventoryItemId,
          quantity: quantity
        })
        .select(`
          id,
          inventory_item_id,
          quantity,
          inventory_items (
            item_name,
            item_id,
            quantity
          )
        `)
        .single();

      if (error) throw error;

      // Add to local state
      const newItem: CartItem = {
        id: data.id,
        inventory_item_id: data.inventory_item_id,
        quantity: data.quantity,
        item_name: data.inventory_items?.item_name || 'Unknown Item',
        item_id: data.inventory_items?.item_id || '',
        available_quantity: data.inventory_items?.quantity || 0
      };

      setCartItems(prev => [...prev, newItem]);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add item to cart');
    }
  };

  const updateItemQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      return removeItem(cartItemId);
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', cartItemId);

      if (error) throw error;

      // Update local state
      setCartItems(prev =>
        prev.map(item =>
          item.id === cartItemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update item quantity');
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;

      // Remove from local state
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to remove item from cart');
    }
  };

  const addRecipe = async (recipeId: string, servingsMultiplier: number = 1.0) => {
    if (!sessionId) throw new Error('No session available');

    try {
      // Add recipe to database
      const { data, error } = await supabase
        .from('cart_recipes')
        .insert({
          session_id: sessionId,
          recipe_id: recipeId,
          servings_multiplier: servingsMultiplier
        })
        .select(`
          id,
          recipe_id,
          servings_multiplier,
          recipes (
            id,
            title,
            ingredients,
            directions,
            image_url
          )
        `)
        .single();

      if (error) throw error;

      // Add to local state
      const newRecipe: CartRecipe = {
        id: data.id,
        recipe_id: data.recipe_id,
        servings_multiplier: data.servings_multiplier,
        recipe: {
          id: data.recipes?.id || '',
          title: data.recipes?.title || 'Unknown Recipe',
          ingredients: data.recipes?.ingredients || [],
          directions: data.recipes?.directions || [],
          image_url: data.recipes?.image_url
        }
      };

      setCartRecipes(prev => [...prev, newRecipe]);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add recipe to cart');
    }
  };

  const updateRecipeServings = async (cartRecipeId: string, newMultiplier: number) => {
    try {
      const { error } = await supabase
        .from('cart_recipes')
        .update({ 
          servings_multiplier: newMultiplier,
          updated_at: new Date().toISOString()
        })
        .eq('id', cartRecipeId);

      if (error) throw error;

      // Update local state
      setCartRecipes(prev =>
        prev.map(recipe =>
          recipe.id === cartRecipeId
            ? { ...recipe, servings_multiplier: newMultiplier }
            : recipe
        )
      );
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update recipe servings');
    }
  };

  const removeRecipe = async (cartRecipeId: string) => {
    try {
      const { error } = await supabase
        .from('cart_recipes')
        .delete()
        .eq('id', cartRecipeId);

      if (error) throw error;

      // Remove from local state
      setCartRecipes(prev => prev.filter(recipe => recipe.id !== cartRecipeId));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to remove recipe from cart');
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalRecipes = () => {
    return cartRecipes.length;
  };

  const clearCart = async () => {
    if (!sessionId) return;

    try {
      // Clear from database
      await Promise.all([
        supabase.from('cart_items').delete().eq('session_id', sessionId),
        supabase.from('cart_recipes').delete().eq('session_id', sessionId)
      ]);

      // Clear local state
      setCartItems([]);
      setCartRecipes([]);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to clear cart');
    }
  };

  const refreshCart = async () => {
    if (sessionId) {
      await loadCartData(sessionId);
    }
  };

  const value: CartContextType = {
    cartItems,
    cartRecipes,
    sessionId,
    loading,
    error,
    addItem,
    updateItemQuantity,
    removeItem,
    addRecipe,
    updateRecipeServings,
    removeRecipe,
    getTotalItems,
    getTotalRecipes,
    clearCart,
    refreshCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}