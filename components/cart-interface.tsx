'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';

export interface ExportData {
  recipes: any[];
  items: any[];
  totalItems: number;
  totalRecipes: number;
}

interface CartInterfaceProps {
  onExport: (data: ExportData) => void;
}

export function CartInterface({ onExport }: CartInterfaceProps) {
  const {
    cartItems,
    cartRecipes,
    loading,
    error,
    updateItemQuantity,
    removeItem,
    updateRecipeServings,
    removeRecipe,
    getTotalItems,
    getTotalRecipes
  } = useCart();

  const handleExport = () => {
    const exportData: ExportData = {
      recipes: cartRecipes,
      items: cartItems,
      totalItems: getTotalItems(),
      totalRecipes: getTotalRecipes()
    };
    
    onExport(exportData);
  };

  const getTotalIngredients = () => {
    return cartRecipes.reduce((total, recipe) => {
      return total + (recipe.recipe?.ingredients?.length || 0);
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-4">🛒</div>
          <p className="text-muted-foreground">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
        <p className="font-medium">Error loading cart</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  const isEmpty = cartRecipes.length === 0 && cartItems.length === 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Your Cart</h2>
        <p className="text-muted-foreground">
          Review your selected recipes and items
        </p>
      </div>

      {isEmpty ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-2xl font-bold mb-2">Your cart is empty</h3>
          <p className="text-muted-foreground">
            Add some recipes or items to get started
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Cart Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Cart Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{getTotalRecipes()}</div>
                  <div className="text-sm text-muted-foreground">Recipes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{getTotalIngredients()}</div>
                  <div className="text-sm text-muted-foreground">Ingredients</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{cartItems.length}</div>
                  <div className="text-sm text-muted-foreground">Individual Items</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{getTotalItems()}</div>
                  <div className="text-sm text-muted-foreground">Total Quantity</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recipe Items */}
          {cartRecipes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recipes</h3>
              {cartRecipes.map((cartRecipe) => (
                <Card key={cartRecipe.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold mb-2">
                          {cartRecipe.recipe?.title || 'Unknown Recipe'}
                        </h4>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <Badge variant="secondary">
                            {cartRecipe.servings_multiplier}x servings
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {cartRecipe.recipe?.ingredients?.length || 0} ingredients
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateRecipeServings(cartRecipe.id, Math.max(0.5, cartRecipe.servings_multiplier - 0.5))}
                            disabled={cartRecipe.servings_multiplier <= 0.5}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          <span className="text-sm font-medium px-3">
                            {cartRecipe.servings_multiplier}x
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateRecipeServings(cartRecipe.id, cartRecipe.servings_multiplier + 0.5)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRecipe(cartRecipe.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Individual Items */}
          {cartItems.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Individual Items</h3>
              {cartItems.map((cartItem) => (
                <Card key={cartItem.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold mb-1">
                          {cartItem.item_name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          ID: {cartItem.item_id} • Available: {cartItem.available_quantity}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateItemQuantity(cartItem.id, cartItem.quantity - 1)}
                            disabled={cartItem.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          <span className="text-sm font-medium px-3">
                            {cartItem.quantity}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateItemQuantity(cartItem.id, cartItem.quantity + 1)}
                            disabled={cartItem.quantity >= cartItem.available_quantity}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(cartItem.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Export Button */}
          <div className="flex justify-center pt-6">
            <Button
              onClick={handleExport}
              className="px-8 py-3 text-lg"
              size="lg"
            >
              Export Cart ({getTotalRecipes() + cartItems.length} items)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
