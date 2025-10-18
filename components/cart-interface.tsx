'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, ExternalLink } from 'lucide-react';
import { supabase, CartRecipe } from '@/lib/supabase';
import { getSessionId } from '@/lib/session';
import { Separator } from '@/components/ui/separator';

interface CartInterfaceProps {
  onExport: (cartData: ExportData) => void;
}

export interface ExportData {
  recipes: Array<{
    recipeId: number;
    recipeTitle: string;
    servingsMultiplier: number;
    ingredients: Array<{
      name: string;
      quantity: number;
    }>;
  }>;
  totalItems: number;
}

export function CartInterface({ onExport }: CartInterfaceProps) {
  const [cartItems, setCartItems] = useState<CartRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    const sessionId = getSessionId();
    const { data, error } = await supabase
      .from('cart_recipes')
      .select('*, recipe:recipes(*)')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCartItems(data as CartRecipe[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateServings = async (itemId: number, newMultiplier: number) => {
    if (newMultiplier <= 0) return;

    await supabase
      .from('cart_recipes')
      .update({
        servings_multiplier: newMultiplier,
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId);

    loadCart();
  };

  const removeItem = async (itemId: number) => {
    await supabase.from('cart_recipes').delete().eq('id', itemId);
    loadCart();
  };

  const handleExport = () => {
    const exportData: ExportData = {
      recipes: cartItems.map(item => ({
        recipeId: item.recipe_id,
        recipeTitle: item.recipe?.title || '',
        servingsMultiplier: item.servings_multiplier,
        ingredients: (item.recipe?.ingredients || []).map((ingredient: string) => ({
          name: ingredient,
          quantity: item.servings_multiplier,
        })),
      })),
      totalItems: cartItems.reduce(
        (sum, item) => sum + (item.recipe?.ingredients?.length || 0),
        0
      ),
    };

    onExport(exportData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading cart...</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h3 className="text-2xl font-bold mb-2">Your cart is empty</h3>
        <p className="text-muted-foreground">
          Swipe right on recipes you like to add them here
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Your Recipe Cart</h2>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {cartItems.length} recipe{cartItems.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{item.recipe?.title}</CardTitle>
                  {item.recipe?.link && (
                    <a
                      href={item.recipe.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      View full recipe <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Servings:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        updateServings(item.id, item.servings_multiplier - 0.5)
                      }
                      disabled={item.servings_multiplier <= 0.5}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold">
                      {item.servings_multiplier}x
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        updateServings(item.id, item.servings_multiplier + 0.5)
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                  Ingredients ({item.recipe?.ingredients?.length || 0})
                </h4>
                <ul className="space-y-2">
                  {(item.recipe?.ingredients || []).map((ingredient: string, index: number) => (
                    <li key={index} className="text-sm pl-4 relative before:content-['•'] before:absolute before:left-0">
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1">Ready to checkout?</h3>
              <p className="text-sm text-muted-foreground">
                Export your recipe ingredients to the food bank cart
              </p>
            </div>
            <Button onClick={handleExport} size="lg">
              Export to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
