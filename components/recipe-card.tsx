'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';
import { MatchedRecipe } from '@/lib/recipe-matcher';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/hooks/use-toast';

interface RecipeCardProps {
  recipe: MatchedRecipe;
  onSwipe: (direction: 'left' | 'right') => void;
  style?: React.CSSProperties;
}

export function RecipeCard({ recipe, onSwipe, style }: RecipeCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const { addRecipe } = useCart();
  const { toast } = useToast();

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setDragOffset({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setDragOffset({
      x: e.touches[0].clientX - startPos.x,
      y: e.touches[0].clientY - startPos.y,
    });
  };

  const handleEnd = async () => {
    if (!isDragging || isProcessing) return;
    
    setIsDragging(false);
    const swipeThreshold = 100;

    if (Math.abs(dragOffset.x) > swipeThreshold) {
      const direction = dragOffset.x > 0 ? 'right' : 'left';
      
      console.log('Swipe detected:', { direction, recipeId: recipe.id, dragOffset: dragOffset.x });

      // If swiped right (liked), add to cart via context
      if (direction === 'right') {
        setIsProcessing(true);
        try {
          console.log('Adding recipe to cart:', recipe.id, recipe.title);
          await addRecipe(recipe.id.toString());
          
          toast({
            title: 'Recipe added! 🎉',
            description: `${recipe.title} has been added to your cart.`,
          });
          console.log('Recipe successfully added to cart');
        } catch (error) {
          console.error('Failed to add recipe to cart:', error);
          toast({
            title: 'Error',
            description: 'Failed to add recipe to cart. Please try again.',
            variant: 'destructive',
          });
          // Don't proceed with swipe if there was an error
          setDragOffset({ x: 0, y: 0 });
          setIsProcessing(false);
          return;
        }
        setIsProcessing(false);
      }
      
      // Call the parent's onSwipe for UI management (removing card, etc.)
      console.log('Calling onSwipe callback');
      onSwipe(direction);
    }

    setDragOffset({ x: 0, y: 0 });
  };

  // Add button handlers for debugging
  const handleLikeButton = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Like button clicked for recipe:', recipe.id, recipe.title);
    
    try {
      setIsProcessing(true);
      await addRecipe(recipe.id.toString());
      
      toast({
        title: 'Recipe added! 🎉',
        description: `${recipe.title} has been added to your cart.`,
      });
      
      // Call onSwipe to move to next card
      onSwipe('right');
    } catch (error) {
      console.error('Failed to add recipe to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add recipe to cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePassButton = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Pass button clicked for recipe:', recipe.id);
    onSwipe('left');
  };

  const rotation = isDragging ? (dragOffset.x / 20) : 0;
  const opacity = isDragging ? Math.max(0.3, 1 - Math.abs(dragOffset.x) / 500) : 1;

  return (
    <Card
      className="absolute w-full max-w-md cursor-grab active:cursor-grabbing select-none overflow-hidden"
      style={{
        ...style,
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
        opacity,
        transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleEnd}
    >
      <div className="relative">
        <div className="h-64 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="text-6xl">🍳</div>
          )}
        </div>

        {isDragging && dragOffset.x > 50 && (
          <div className="absolute top-8 right-8 bg-green-500 text-white px-6 py-3 rounded-lg font-bold text-xl transform rotate-12 shadow-lg">
            LIKE ❤️
          </div>
        )}

        {isDragging && dragOffset.x < -50 && (
          <div className="absolute top-8 left-8 bg-red-500 text-white px-6 py-3 rounded-lg font-bold text-xl transform -rotate-12 shadow-lg">
            PASS ✕
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-2xl font-bold flex-1">{recipe.title}</h2>
          <Badge variant={recipe.matchScore >= 0.9 ? 'default' : 'secondary'} className="ml-2">
            {Math.round(recipe.matchScore * 100)}% Match
          </Badge>
        </div>

        <div className="space-y-3 max-h-48 overflow-y-auto mb-6">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Ingredients ({recipe.totalIngredients})
          </h3>

          {recipe.availableIngredients.map((ingredient, index) => (
            <div key={`available-${index}`} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-green-700">{ingredient}</span>
            </div>
          ))}

          {recipe.missingIngredients.map((ingredient, index) => (
            <div key={`missing-${index}`} className="flex items-start gap-2 text-sm">
              <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">{ingredient}</span>
            </div>
          ))}
        </div>

        {/* Add action buttons for easier interaction */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handlePassButton}
            className="flex-1 py-3 px-4 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors"
            disabled={isProcessing}
          >
            Pass ✕
          </button>
          <button
            onClick={handleLikeButton}
            className="flex-1 py-3 px-4 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition-colors disabled:bg-gray-200 disabled:text-gray-400"
            disabled={isProcessing}
          >
            {isProcessing ? 'Adding...' : 'Like ❤️'}
          </button>
        </div>
      </div>
    </Card>
  );
}
