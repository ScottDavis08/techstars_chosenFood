import React from 'react';
import { RecipeCategory, DietaryTag } from '@/types';
import { RecipeFormState } from './useFormData';

interface RecipeDetailsTabProps {
  recipe: RecipeFormState;
  handleRecipeChange: (field: string, value: string | string[]) => void;
  toggleCategory: (category: RecipeCategory) => void;
  toggleDietaryTag: (tag: DietaryTag) => void;
  updateTotalTime: () => void;
}

export default function RecipeDetailsTab({ 
  recipe, 
  handleRecipeChange, 
  toggleCategory, 
  toggleDietaryTag,
  updateTotalTime 
}: RecipeDetailsTabProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text">Recipe Title *</span>
          </label>
          <input 
            type="text" 
            placeholder="Enter recipe title" 
            className="input input-bordered"
            value={recipe.title}
            onChange={(e) => handleRecipeChange('title', e.target.value)}
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Servings</span>
          </label>
          <input 
            type="number" 
            placeholder="Number of servings" 
            className="input input-bordered"
            value={recipe.servings}
            onChange={(e) => handleRecipeChange('servings', e.target.value)}
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Recipe Link (Optional)</span>
          </label>
          <input 
            type="url" 
            placeholder="https://..." 
            className="input input-bordered"
            value={recipe.link}
            onChange={(e) => handleRecipeChange('link', e.target.value)}
          />
        </div>
      </div>

      {/* Time Information */}
      <div className="divider">Time Information</div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Prep Time (minutes)</span>
          </label>
          <input 
            type="number" 
            placeholder="0" 
            className="input input-bordered"
            value={recipe.prepTime}
            onChange={(e) => {
              handleRecipeChange('prepTime', e.target.value);
              setTimeout(updateTotalTime, 0);
            }}
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Cook Time (minutes)</span>
          </label>
          <input 
            type="number" 
            placeholder="0" 
            className="input input-bordered"
            value={recipe.cookTime}
            onChange={(e) => {
              handleRecipeChange('cookTime', e.target.value);
              setTimeout(updateTotalTime, 0);
            }}
          />
        </div>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Total Time (minutes)</span>
          </label>
          <input 
            type="number" 
            placeholder="Auto-calculated" 
            className="input input-bordered"
            value={recipe.totalTime}
            onChange={(e) => handleRecipeChange('totalTime', e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="divider">Categories</div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Select Categories (Multiple)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.values(RecipeCategory).map(category => (
            <button
              key={category}
              type="button"
              className={`btn btn-sm ${
                recipe.category.includes(category) ? 'btn-primary' : 'btn-outline'
              }`}
              onClick={() => toggleCategory(category)}
            >
              {category.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Dietary Tags */}
      <div className="divider">Dietary Information</div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Dietary Tags (Multiple)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.values(DietaryTag).map(tag => (
            <button
              key={tag}
              type="button"
              className={`btn btn-sm ${
                recipe.dietaryTags.includes(tag) ? 'btn-success' : 'btn-outline'
              }`}
              onClick={() => toggleDietaryTag(tag)}
            >
              {tag.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}