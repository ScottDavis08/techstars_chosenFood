"use client"
import React, { useState, useEffect } from 'react';
import { Recipe } from '@/types';
import RecipeDescription from '@/components/property_description';
import ImageCarousel from '@/components/image_carousel';
import Link from 'next/link';
import { use } from 'react';

// Mock API - replace with actual API calls
const mockApi = {
  getRecipe: async (id: string) => ({
    success: true,
    data: null as Recipe | null,
    error: { message: 'Recipe not found' }
  })
};

// Page Component for Next.js App Router
interface PageProps {
  params: Promise<{ recipeId: string }>;
}

const RecipeDetailPage: React.FC<PageProps> = ({ params }) => {
  const { recipeId } = use(params);
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const response = await mockApi.getRecipe(recipeId);
        if (response.success && response.data) {
          setRecipe(response.data);
        } else {
          setError(response.error?.message || 'Failed to load recipe');
        }
      } catch {
        setError('Error loading recipe data');
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [recipeId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="breadcrumbs text-sm">
          <ul>
            <li><Link href="/application/">Dashboard</Link></li>
            <li><Link href="/application/recipes">Recipes</Link></li>
            <li>{recipe.title}</li>
          </ul>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mt-2">{recipe.title}</h1>
      </div>

      {/* Image Carousel */}
      {recipe.image && (
        <div className="mb-8">
          <ImageCarousel images={[recipe.image]} />
        </div>
      )}

      {/* Recipe Description */}
      <RecipeDescription recipe={recipe} />

      {/* Nutrition Information */}
      {recipe.nutrition && (
        <div className="card bg-base-100 shadow-md mt-6">
          <div className="card-body">
            <h2 className="card-title text-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Nutrition Facts
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
              {recipe.nutrition.calories && (
                <div>
                  <span className="font-medium">Calories:</span>
                  <span className="ml-2">{recipe.nutrition.calories}</span>
                </div>
              )}
              {recipe.nutrition.protein && (
                <div>
                  <span className="font-medium">Protein:</span>
                  <span className="ml-2">{recipe.nutrition.protein}g</span>
                </div>
              )}
              {recipe.nutrition.totalCarbohydrates && (
                <div>
                  <span className="font-medium">Carbs:</span>
                  <span className="ml-2">{recipe.nutrition.totalCarbohydrates}g</span>
                </div>
              )}
              {recipe.nutrition.totalFat && (
                <div>
                  <span className="font-medium">Fat:</span>
                  <span className="ml-2">{recipe.nutrition.totalFat}g</span>
                </div>
              )}
              {recipe.nutrition.dietaryFiber && (
                <div>
                  <span className="font-medium">Fiber:</span>
                  <span className="ml-2">{recipe.nutrition.dietaryFiber}g</span>
                </div>
              )}
              {recipe.nutrition.sodium && (
                <div>
                  <span className="font-medium">Sodium:</span>
                  <span className="ml-2">{recipe.nutrition.sodium}mg</span>
                </div>
              )}
              {recipe.nutrition.totalSugars && (
                <div>
                  <span className="font-medium">Sugar:</span>
                  <span className="ml-2">{recipe.nutrition.totalSugars}g</span>
                </div>
              )}
              {recipe.nutrition.calcium && (
                <div>
                  <span className="font-medium">Calcium:</span>
                  <span className="ml-2">{recipe.nutrition.calcium}mg</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
        <button className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Add to Favorites
        </button>
        
        <button className="btn btn-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add to Meal Plan
        </button>
        
        <button className="btn btn-outline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share Recipe
        </button>

        <button className="btn btn-outline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Recipe
        </button>
      </div>
    </div>
  );
};

export default RecipeDetailPage;