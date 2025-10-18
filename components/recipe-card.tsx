'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';
import { MatchedRecipe } from '@/lib/recipe-matcher';

interface RecipeCardProps {
  recipe: MatchedRecipe;
  onSwipe: (direction: 'left' | 'right') => void;
  style?: React.CSSProperties;
}

export function RecipeCard({ recipe, onSwipe, style }: RecipeCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setDragOffset({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setDragOffset({
      x: e.touches[0].clientX - startPos.x,
      y: e.touches[0].clientY - startPos.y,
    });
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(dragOffset.x) > 100) {
      onSwipe(dragOffset.x > 0 ? 'right' : 'left');
    }

    setDragOffset({ x: 0, y: 0 });
  };

  const rotation = isDragging ? (dragOffset.x / 20) : 0;
  const opacity = isDragging ? 1 - Math.abs(dragOffset.x) / 500 : 1;

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
          <div className="absolute top-8 right-8 bg-green-500 text-white px-6 py-3 rounded-lg font-bold text-xl transform rotate-12">
            LIKE
          </div>
        )}

        {isDragging && dragOffset.x < -50 && (
          <div className="absolute top-8 left-8 bg-red-500 text-white px-6 py-3 rounded-lg font-bold text-xl transform -rotate-12">
            PASS
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

        <div className="space-y-3 max-h-64 overflow-y-auto">
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
      </div>
    </Card>
  );
}
