"use client"
import React, { useState, useEffect } from 'react';
import { Eye, Calendar, Clock, AlertCircle, ThumbsDown, ThumbsUp, ChefHat } from 'lucide-react';
import { Recipe, RecipeCategory, DietaryTag } from '@/types';
import ImageCarousel from '@/components/image_carousel';

// Mock API - replace with actual API calls
const mockApi = {
  getRecipes: async () => ({
    success: true,
    data: [] as Recipe[] // Your recipe data here
  })
};

const RecipesPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cardTransform, setCardTransform] = useState({ x: 0, y: 0, rotate: 0, opacity: 1 });
  const [isDragging] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await mockApi.getRecipes();
        
        if (!response.success) {
          throw new Error('Failed to fetch recipes');
        }

        setRecipes(response.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const goToNextRecipe = () => {
    if (currentRecipeIndex < recipes.length - 1) {
      setCurrentRecipeIndex(currentRecipeIndex + 1);
    }
    setCardTransform({ x: 0, y: 0, rotate: 0, opacity: 1 });
  };

  const goToPreviousRecipe = () => {
    if (currentRecipeIndex > 0) {
      setCurrentRecipeIndex(currentRecipeIndex - 1);
    }
    setCardTransform({ x: 0, y: 0, rotate: 0, opacity: 1 });
  };

  const handleViewRecipe = () => {
    const recipeId = recipes[currentRecipeIndex]?.id;
    if (recipeId) {
      window.location.href = `/application/recipes/${recipeId}`;
    }
  };

  const handleLike = () => {
    const recipe = recipes[currentRecipeIndex];
    setFavorites([...favorites, recipe.id]);
    setCardTransform({ x: window.innerWidth, y: 0, rotate: 30, opacity: 0 });
    setTimeout(() => {
      goToNextRecipe();
    }, 300);
  };

  const handleDislike = () => {
    const recipe = recipes[currentRecipeIndex];
    setRejected([...rejected, recipe.id]);
    setCardTransform({ x: -window.innerWidth, y: 0, rotate: -30, opacity: 0 });
    setTimeout(() => {
      goToNextRecipe();
    }, 300);
  };

  const formatTime = (minutes: number | undefined) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes} mins`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="alert alert-error max-w-md">
          <AlertCircle className="h-5 w-5" />
          <div>
            <h3 className="font-bold">Error</h3>
            <div className="text-xs">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipes.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <div className="text-base-content/50 mb-4">
            <ChefHat className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-bold">No Recipes Available</h2>
          <p className="text-sm opacity-70 mt-2">Check back later for new recipes.</p>
        </div>
      </div>
    );
  }

  const currentRecipe = recipes[currentRecipeIndex];

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Single Card */}
        <div 
          className="relative"
          style={{
            transform: `translateX(${cardTransform.x}px) translateY(${cardTransform.y}px) rotate(${cardTransform.rotate}deg)`,
            opacity: cardTransform.opacity,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out'
          }}
        >
          <div className="card bg-base-100 shadow-xl overflow-hidden">
            {/* Image Carousel */}
            {currentRecipe.image && (
              <ImageCarousel images={[currentRecipe.image]} />
            )}
            
            {/* Card Content */}
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="card-title">{currentRecipe.title}</h2>
                  {currentRecipe.servings && (
                    <p className="text-sm opacity-70">Serves {currentRecipe.servings}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  {currentRecipe.rating && (
                    <div className="flex items-center gap-1">
                      <span className="text-sm">⭐</span>
                      <span className="text-sm font-medium">{currentRecipe.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Categories & Dietary Tags */}
              <div className="flex flex-wrap gap-2">
                {currentRecipe.category?.map((cat) => (
                  <span key={cat} className="badge badge-primary badge-sm">
                    {cat.replace(/_/g, ' ')}
                  </span>
                ))}
                {currentRecipe.dietaryTags?.map((tag) => (
                  <span key={tag} className="badge badge-success badge-sm">
                    {tag.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm opacity-70 mt-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Prep: {formatTime(currentRecipe.prepTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Cook: {formatTime(currentRecipe.cookTime)}</span>
                </div>
              </div>

              {/* Ingredients Preview */}
              <div className="mt-4">
                <h3 className="font-semibold text-sm mb-2">Key Ingredients:</h3>
                <div className="text-sm opacity-70">
                  {currentRecipe.ingredients.slice(0, 5).map((ing) => (
                    <span key={ing.id}>{ing.ingredientName}, </span>
                  ))}
                  {currentRecipe.ingredients.length > 5 && '...'}
                </div>
              </div>

              <div className="card-actions justify-between items-center pt-4 border-t border-base-300">
                <span className="text-sm opacity-70">
                  Total Time: {formatTime(currentRecipe.totalTime)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-6">
          <button 
            onClick={handleDislike}
            className="btn btn-circle btn-lg btn-error"
            title="Not interested"
          >
            <ThumbsDown className="h-7 w-7" />
          </button>
          
          <button 
            onClick={handleViewRecipe}
            className="btn btn-circle btn-lg btn-primary"
            title="View full recipe"
          >
            <Eye className="h-7 w-7" />
          </button>
          
          <button 
            onClick={handleLike}
            className="btn btn-circle btn-lg btn-success"
            title="Add to favorites"
          >
            <ThumbsUp className="h-7 w-7" />
          </button>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex justify-between items-center">
          <button 
            onClick={goToPreviousRecipe}
            disabled={currentRecipeIndex === 0}
            className="btn btn-ghost btn-sm"
          >
            ← Previous
          </button>
          
          <div className="text-center text-sm opacity-70">
            Recipe {currentRecipeIndex + 1} of {recipes.length}
          </div>
          
          <button 
            onClick={goToNextRecipe}
            disabled={currentRecipeIndex === recipes.length - 1}
            className="btn btn-ghost btn-sm"
          >
            Next →
          </button>
        </div>

        {/* Stats */}
        <div className="mt-6 stats stats-vertical lg:stats-horizontal shadow w-full">
          <div className="stat">
            <div className="stat-title">Favorites</div>
            <div className="stat-value text-success">{favorites.length}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Passed</div>
            <div className="stat-value text-error">{rejected.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipesPage;