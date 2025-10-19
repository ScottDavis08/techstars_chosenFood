'use client';

import { useState, useEffect } from 'react';
import { RecipeCard } from './recipe-card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { X, Heart, RotateCcw } from 'lucide-react';
import { MatchedRecipe } from '@/lib/recipe-matcher';
import { supabase } from '@/lib/supabase';
import { getSessionId } from '@/lib/session';

interface SwipeInterfaceProps {
  recipes: MatchedRecipe[];
}

export function SwipeInterface({ recipes }: SwipeInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tolerance, setTolerance] = useState(70);
  const [filteredRecipes, setFilteredRecipes] = useState<MatchedRecipe[]>([]);

  useEffect(() => {
    const filtered = recipes.filter(
      recipe => recipe.matchScore >= tolerance / 100
    );
    setFilteredRecipes(filtered);
    setCurrentIndex(0);
  }, [recipes, tolerance]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    const currentRecipe = filteredRecipes[currentIndex];
    if (!currentRecipe) return;

    const sessionId = getSessionId();

    await supabase.from('recipe_swipes').insert({
      recipe_id: currentRecipe.id,
      session_id: sessionId,
      action: direction === 'right' ? 'like' : 'dislike',
      match_score: currentRecipe.matchScore,
    });

    if (direction === 'right') {
      await supabase.from('cart_recipes').insert({
        recipe_id: currentRecipe.id,
        session_id: sessionId,
        servings_multiplier: 1.0,
      });
    }

    setCurrentIndex(prev => prev + 1);
  };

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    handleSwipe(direction);
  };

  const handleReset = () => {
    setCurrentIndex(0);
  };

  const currentRecipe = filteredRecipes[currentIndex];
  const remainingCount = filteredRecipes.length - currentIndex;

  if (filteredRecipes.length === 0) {
    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4">
        <div className="w-full mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">
              Pantry Match: {tolerance}%
            </label>
            <span className="text-sm text-muted-foreground">
              {remainingCount} recipe{remainingCount !== 1 ? 's' : ''} remaining
            </span>
          </div>
          <Slider
            value={[tolerance]}
            onValueChange={(value) => setTolerance(value[0])}
            min={0}
            max={100}
            step={5}
          />
        </div>
        <p className="text-muted-foreground mb-4">
          Increase match score for more recipes
        </p>
      </div>
    );
  }

  if (!currentRecipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] text-center p-8">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold mb-2">All done!</h3>
        <p className="text-muted-foreground mb-4">
          You've reviewed all available recipes
        </p>
        <Button onClick={handleReset} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          Start Over
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4">
      <div className="w-full mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">
            Pantry Matching: {tolerance}%
          </label>
          <span className="text-sm text-muted-foreground">
            {remainingCount} recipe{remainingCount !== 1 ? 's' : ''} remaining
          </span>
        </div>
        <Slider
          value={[tolerance]}
          onValueChange={(value) => setTolerance(value[0])}
          min={0}
          max={100}
          step={5}
        />
      </div>

      <div className="relative w-full h-[600px] flex items-center justify-center mb-8">
        {filteredRecipes.slice(currentIndex, currentIndex + 3).map((recipe, index) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onSwipe={handleSwipe}
            style={{
              zIndex: 3 - index,
              transform: `scale(${1 - index * 0.05}) translateY(${index * 10}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
