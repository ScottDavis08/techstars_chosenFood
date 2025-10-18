import { ExportData } from '@/components/cart-interface';

export interface ExternalCartItem {
  item_id: string;
  item_name: string;
  quantity: number;
  metadata?: {
    recipe_id?: number;
    recipe_title?: string;
    servings_multiplier?: number;
  };
}

export function convertToExternalCartFormat(exportData: ExportData): ExternalCartItem[] {
  const items: ExternalCartItem[] = [];

  exportData.recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient, index) => {
      items.push({
        item_id: `recipe_${recipe.recipeId}_ingredient_${index}`,
        item_name: ingredient.name,
        quantity: Math.ceil(ingredient.quantity),
        metadata: {
          recipe_id: recipe.recipeId,
          recipe_title: recipe.recipeTitle,
          servings_multiplier: recipe.servingsMultiplier,
        },
      });
    });
  });

  return items;
}

export async function exportToExternalCart(
  exportData: ExportData,
  externalCartApiUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const cartItems = convertToExternalCartFormat(exportData);

    const response = await fetch(externalCartApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: cartItems,
        source: 'recipe_matcher',
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to export to external cart');
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
