import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { IngredientFormState } from './useFormData';

interface IngredientsDirectionsTabProps {
  ingredients: IngredientFormState[];
  directions: string[];
  handleIngredientChange: (index: number, field: keyof IngredientFormState, value: string) => void;
  addIngredient: () => void;
  removeIngredient: (index: number) => void;
  handleDirectionChange: (index: number, value: string) => void;
  addDirection: () => void;
  removeDirection: (index: number) => void;
}

export default function IngredientsDirectionsTab({
  ingredients,
  directions,
  handleIngredientChange,
  addIngredient,
  removeIngredient,
  handleDirectionChange,
  addDirection,
  removeDirection
}: IngredientsDirectionsTabProps) {
  return (
    <div className="space-y-8">
      {/* Ingredients Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Ingredients</h3>
          <button 
            onClick={addIngredient}
            className="btn btn-primary btn-sm"
          >
            <Plus className="w-4 h-4" />
            Add Ingredient
          </button>
        </div>

        <div className="space-y-3">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="card bg-base-200">
              <div className="card-body p-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  {/* Ingredient Name */}
                  <div className="md:col-span-4">
                    <input
                      type="text"
                      placeholder="Ingredient name *"
                      className="input input-bordered input-sm w-full"
                      value={ingredient.ingredientName}
                      onChange={(e) => handleIngredientChange(index, 'ingredientName', e.target.value)}
                    />
                  </div>

                  {/* Quantity */}
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="Quantity"
                      className="input input-bordered input-sm w-full"
                      value={ingredient.quantity}
                      onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                    />
                  </div>

                  {/* Unit */}
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="Unit"
                      className="input input-bordered input-sm w-full"
                      value={ingredient.unit}
                      onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                    />
                  </div>

                  {/* Preparation */}
                  <div className="md:col-span-3">
                    <input
                      type="text"
                      placeholder="Preparation (diced, chopped...)"
                      className="input input-bordered input-sm w-full"
                      value={ingredient.preparation}
                      onChange={(e) => handleIngredientChange(index, 'preparation', e.target.value)}
                    />
                  </div>

                  {/* Remove Button */}
                  <div className="md:col-span-1 flex items-center justify-center">
                    {ingredients.length > 1 && (
                      <button
                        onClick={() => removeIngredient(index)}
                        className="btn btn-sm btn-circle btn-error"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Additional notes (optional)"
                    className="input input-bordered input-sm w-full"
                    value={ingredient.notes}
                    onChange={(e) => handleIngredientChange(index, 'notes', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Directions Section */}
      <div className="divider">Directions</div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Cooking Instructions</h3>
          <button 
            onClick={addDirection}
            className="btn btn-primary btn-sm"
          >
            <Plus className="w-4 h-4" />
            Add Step
          </button>
        </div>

        <div className="space-y-3">
          {directions.map((direction, index) => (
            <div key={index} className="card bg-base-200">
              <div className="card-body p-4">
                <div className="flex gap-3 items-start">
                  <div className="badge badge-primary badge-lg mt-2">
                    {index + 1}
                  </div>
                  <textarea
                    placeholder={`Step ${index + 1} instructions...`}
                    className="textarea textarea-bordered w-full"
                    rows={3}
                    value={direction}
                    onChange={(e) => handleDirectionChange(index, e.target.value)}
                  />
                  {directions.length > 1 && (
                    <button
                      onClick={() => removeDirection(index)}
                      className="btn btn-sm btn-circle btn-error"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Helper Text */}
      <div className="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <h3 className="font-bold">Tips for Better Recipes</h3>
          <div className="text-sm">
            Be specific with measurements and include details like temperature and timing in your directions. This helps ensure consistent results for food bank clients.
          </div>
        </div>
      </div>
    </div>
  );
}