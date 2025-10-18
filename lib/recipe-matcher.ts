import { Recipe, InventoryItem } from './supabase';

export type MatchedRecipe = Recipe & {
  matchScore: number;
  availableIngredients: string[];
  missingIngredients: string[];
  totalIngredients: number;
};

function normalizeIngredient(ingredient: string): string {
  return ingredient
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .trim()
    .split(/\s+/)
    .filter(word => !['cup', 'cups', 'tablespoon', 'tablespoons', 'teaspoon', 'teaspoons', 'tbsp', 'tsp', 'oz', 'lb', 'pound', 'pounds', 'gram', 'grams', 'g', 'ml', 'liter', 'of', 'the', 'a', 'an', 'to', 'and', 'or', 'fresh', 'dried', 'chopped', 'minced', 'diced', 'sliced'].includes(word))
    .join(' ');
}

function checkIngredientMatch(recipeIngredient: string, inventory: InventoryItem[]): boolean {
  const normalized = normalizeIngredient(recipeIngredient);
  const words = normalized.split(/\s+/);

  return inventory.some(item => {
    const itemName = normalizeIngredient(item.item_name);
    return words.some(word => itemName.includes(word) || word.includes(itemName));
  });
}

export function matchRecipesWithInventory(
  recipes: Recipe[],
  inventory: InventoryItem[],
  toleranceLevel: number = 0.7
): MatchedRecipe[] {
  const matchedRecipes = recipes.map(recipe => {
    const ingredients = recipe.ingredients || [];
    const availableIngredients: string[] = [];
    const missingIngredients: string[] = [];

    ingredients.forEach(ingredient => {
      if (checkIngredientMatch(ingredient, inventory)) {
        availableIngredients.push(ingredient);
      } else {
        missingIngredients.push(ingredient);
      }
    });

    const matchScore = ingredients.length > 0
      ? availableIngredients.length / ingredients.length
      : 0;

    return {
      ...recipe,
      matchScore,
      availableIngredients,
      missingIngredients,
      totalIngredients: ingredients.length,
    };
  });

  return matchedRecipes
    .filter(recipe => recipe.matchScore >= toleranceLevel)
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function calculateMatchScore(recipe: Recipe, inventory: InventoryItem[]): number {
  const ingredients = recipe.ingredients || [];
  if (ingredients.length === 0) return 0;

  const availableCount = ingredients.filter(ingredient =>
    checkIngredientMatch(ingredient, inventory)
  ).length;

  return availableCount / ingredients.length;
}
