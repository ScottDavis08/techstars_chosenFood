"use client"

import React, { useState } from 'react';
import RecipeDetailsTab from './recipe_details_tab';
import IngredientsDirectionsTab from './ingredients_directions_tab';
import RecipeImageTab from './recipe_image_tab';
import { useFormData } from './useFormData';

export default function RecipeUploadForm() {
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'image'>('details');
  const { 
    recipe, 
    ingredients,
    directions,
    image,
    handleRecipeChange, 
    toggleCategory,
    toggleDietaryTag,
    handleIngredientChange,
    addIngredient,
    removeIngredient,
    handleDirectionChange,
    addDirection,
    removeDirection,
    handleImageUpload,
    removeImage,
    updateTotalTime,
    handleSubmit 
  } = useFormData();

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Add New Recipe</h2>
          
          {/* Tabs */}
          <div className="tabs tabs-boxed mb-6 w-full">
            <a 
              className={`tab tab-lg flex-1 ${activeTab === 'details' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Recipe Details
            </a>
            <a 
              className={`tab tab-lg flex-1 ${activeTab === 'ingredients' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('ingredients')}
            >
              Ingredients & Directions
            </a>
            <a 
              className={`tab tab-lg flex-1 ${activeTab === 'image' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('image')}
            >
              Recipe Image
            </a>
          </div>

          {/* Tab Content */}
          {activeTab === 'details' && (
            <RecipeDetailsTab 
              recipe={recipe}
              handleRecipeChange={handleRecipeChange}
              toggleCategory={toggleCategory}
              toggleDietaryTag={toggleDietaryTag}
              updateTotalTime={updateTotalTime}
            />
          )}

          {activeTab === 'ingredients' && (
            <IngredientsDirectionsTab 
              ingredients={ingredients}
              directions={directions}
              handleIngredientChange={handleIngredientChange}
              addIngredient={addIngredient}
              removeIngredient={removeIngredient}
              handleDirectionChange={handleDirectionChange}
              addDirection={addDirection}
              removeDirection={removeDirection}
            />
          )}

          {activeTab === 'image' && (
            <RecipeImageTab 
              image={image}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
            />
          )}
          
          {/* Form Actions */}
          <div className="card-actions justify-end mt-8">
            <button className="btn btn-outline">Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Save Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}