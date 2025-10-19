'use client';

import { useState, useEffect } from 'react';
import { SwipeInterface } from '@/components/swipe-interface';
import { CartInterface, ExportData } from '@/components/cart-interface';
import { CategorySelection } from '@/components/categories_card';
import { InventoryInterface } from '@/components/inventory-interface';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase, Recipe, InventoryItem } from '@/lib/supabase';
import { matchRecipesWithInventory, MatchedRecipe } from '@/lib/recipe-matcher';
import { convertToExternalCartFormat } from '@/lib/cart-adapter';
import { ShoppingCart, Utensils, Filter, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/cart-context';

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [matchedRecipes, setMatchedRecipes] = useState<MatchedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('categories');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [exportedItemCount, setExportedItemCount] = useState(0);
  const { toast } = useToast();
  const { addItem, getTotalItems, getTotalRecipes } = useCart();

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

  const handleInventoryItemAdded = async (itemId: string, quantity: number) => {
    try {
      await addItem(itemId, quantity);
      toast({
        title: 'Item added!',
        description: `${quantity} item(s) added to your cart.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleExport = (exportData: ExportData) => {
    const cartItems = convertToExternalCartFormat(exportData);

    console.log('Export to external cart system:', {
      items: cartItems,
      source: 'recipe_matcher',
      timestamp: new Date().toISOString(),
    });

    setExportedItemCount(exportData.totalItems);
    setShowSuccessModal(true);

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

  const cartItemCount = getTotalItems() + getTotalRecipes();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md mx-4 text-center">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Order number 53420 has been submitted successfully. Please proceed to parking spot #8.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold">Foodback Loop</h1>
          <p className="text-muted-foreground mt-1">
            Reducing food waste with smart choices
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="swipe" className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              Recipes
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="cart" className="flex items-center gap-2 relative">
              <ShoppingCart className="h-4 w-4" />
              Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            <CategorySelection onContinue={handleCategoriesSelected} />
          </TabsContent>

          <TabsContent value="swipe">
            {matchedRecipes.length > 0 ? (
              <SwipeInterface
                recipes={matchedRecipes}
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

          <TabsContent value="inventory">
            <InventoryInterface onItemAdded={handleInventoryItemAdded} />
          </TabsContent>

          <TabsContent value="cart">
            <CartInterface onExport={handleExport} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}