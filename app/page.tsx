'use client';

import { useState, useEffect } from 'react';
import { SwipeInterface } from '@/components/swipe-interface';
import { CartInterface, ExportData } from '@/components/cart-interface';
import { CategorySelection } from '@/components/categories_card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { supabase, Recipe, InventoryItem } from '@/lib/supabase';
import { matchRecipesWithInventory, MatchedRecipe } from '@/lib/recipe-matcher';
import { convertToExternalCartFormat } from '@/lib/cart-adapter';
import { ShoppingCart, Utensils, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [matchedRecipes, setMatchedRecipes] = useState<MatchedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('categories');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [recipesResult, inventoryResult] = await Promise.all([
      supabase.from('recipes').select('*'),
      supabase.from('inventory_items').select('*'),
    ]);

    if (recipesResult.data) {
      setRecipes(recipesResult.data);
    }

    if (inventoryResult.data) {
      setInventory(inventoryResult.data);
    }

    if (recipesResult.data && inventoryResult.data) {
      const matched = matchRecipesWithInventory(recipesResult.data, inventoryResult.data);
      setMatchedRecipes(matched);
    }

    setLoading(false);
  };

  const handleCategoriesSelected = (categories: string[]) => {
    setSelectedCategories(categories);
    setActiveTab('swipe');
    toast({
      title: 'Preferences saved!',
      description: `${categories.length} filter${categories.length !== 1 ? 's' : ''} applied to recipes.`,
    });
  };

  const handleRecipeLiked = () => {
    toast({
      title: 'Recipe added!',
      description: 'Check your cart to review and adjust servings.',
    });
  };

  const handleExport = (exportData: ExportData) => {
    const cartItems = convertToExternalCartFormat(exportData);

    console.log('Export to external cart system:', {
      items: cartItems,
      source: 'recipe_matcher',
      timestamp: new Date().toISOString(),
    });

    toast({
      title: 'Cart exported!',
      description: `${exportData.totalItems} ingredients ready for checkout.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍳</div>
          <p className="text-muted-foreground">Loading recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold">Food Bank Recipe Matcher</h1>
          <p className="text-muted-foreground mt-1">
            Discover delicious recipes based on available ingredients
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="swipe" className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              Recipes
            </TabsTrigger>
            <TabsTrigger value="cart" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Cart
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            <CategorySelection onContinue={handleCategoriesSelected} />
          </TabsContent>

          <TabsContent value="swipe">
            {matchedRecipes.length > 0 ? (
              <SwipeInterface
                recipes={matchedRecipes}
                onRecipeLiked={handleRecipeLiked}
              />
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold mb-2">No recipes available</h3>
                <p className="text-muted-foreground mb-4">
                  Add recipes and inventory to get started
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="cart">
            <CartInterface onExport={handleExport} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}