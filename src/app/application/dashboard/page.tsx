"use client"
import React, { useState, useEffect } from 'react';
import { Recipe, RecipeCategory, Client } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { ChefHat, Users, BookOpen, Clock } from 'lucide-react';

// Mock API - replace with actual API calls
const mockApi = {
  getRecipes: async () => ({
    success: true,
    data: [] as Recipe[]
  }),
  getClients: async () => ({
    success: true,
    data: [] as Client[]
  })
};

const Dashboard: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [filterCategory, setFilterCategory] = useState<RecipeCategory | 'ALL'>('ALL');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [recipesResponse, clientsResponse] = await Promise.all([
          mockApi.getRecipes(),
          mockApi.getClients()
        ]);
        
        if (recipesResponse.success && recipesResponse.data) {
          setRecipes(recipesResponse.data);
        }
        if (clientsResponse.success && clientsResponse.data) {
          setClients(clientsResponse.data);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter recipes based on search term and category
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some(ing => ing.ingredientName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'ALL' || 
      recipe.category?.includes(filterCategory);
    
    return matchesSearch && matchesCategory;
  });

  const formatTime = (minutes: number | undefined) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      {/* Header with Action Buttons */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Recipe Management Dashboard</h1>
            <div className="text-sm breadcrumbs">
              <ul>
                <li><Link href="/">Home</Link></li>
                <li>Dashboard</li>
              </ul>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link href="/application/recipes" className="btn btn-primary">
              <ChefHat className="h-5 w-5" />
              Browse Recipes
            </Link>
            
            <Link href="/application/upload" className="btn btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Recipe
            </Link>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-base flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Total Recipes
            </h2>
            <div className="stat-value text-3xl">{recipes.length}</div>
            <div className="text-sm text-base-content opacity-70">In database</div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-base flex items-center gap-2">
              <Users className="h-5 w-5" />
              Active Clients
            </h2>
            <div className="stat-value text-3xl text-success">{clients.length}</div>
            <div className="text-sm text-base-content opacity-70">Registered</div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-base flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Avg. Prep Time
            </h2>
            <div className="stat-value text-3xl">
              {recipes.length > 0 
                ? Math.round(recipes.reduce((sum, r) => sum + (r.prepTime || 0), 0) / recipes.length)
                : 0}m
            </div>
            <div className="text-sm text-base-content opacity-70">Minutes</div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-base">Categories</h2>
            <div className="stat-value text-3xl">{Object.keys(RecipeCategory).length}</div>
            <div className="text-sm text-base-content opacity-70">Available</div>
          </div>
        </div>
      </div>

      {/* Recipe Browser Section */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h2 className="card-title">Recipe Library</h2>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Category Filter */}
              <select 
                className="select select-bordered select-sm"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as RecipeCategory | 'ALL')}
              >
                <option value="ALL">All Categories</option>
                {Object.values(RecipeCategory).map(cat => (
                  <option key={cat} value={cat}>
                    {cat.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
              
              {/* Search */}
              <div className="form-control w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search recipes..."
                  className="input input-bordered input-sm w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {filteredRecipes.length === 0 ? (
            <div className="text-center py-8 text-base-content opacity-70">
              <ChefHat className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>No recipes found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecipes.map(recipe => (
                <div 
                  key={recipe.id} 
                  className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  {recipe.image && (
                    <figure className="h-48">
                      <Image
                        src={recipe.image.url}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                        width={400}
                        height={200}
                      />
                    </figure>
                  )}
                  <div className="card-body p-4">
                    <h3 className="card-title text-base">{recipe.title}</h3>
                    
                    <div className="flex flex-wrap gap-1 my-2">
                      {recipe.category?.slice(0, 2).map(cat => (
                        <span key={cat} className="badge badge-primary badge-xs">
                          {cat.replace(/_/g, ' ')}
                        </span>
                      ))}
                      {recipe.dietaryTags?.slice(0, 2).map(tag => (
                        <span key={tag} className="badge badge-success badge-xs">
                          {tag.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between text-xs opacity-70">
                      <span>⏱️ {formatTime(recipe.totalTime)}</span>
                      <span>🍽️ {recipe.servings || 'N/A'} servings</span>
                      {recipe.rating && <span>⭐ {recipe.rating.toFixed(1)}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal for Selected Recipe */}
      {selectedRecipe && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <h3 className="font-bold text-lg mb-4">{selectedRecipe.title}</h3>
            
            {selectedRecipe.image && (
              <figure className="mb-4">
                <Image
                  src={selectedRecipe.image.url}
                  alt={selectedRecipe.title}
                  className="w-full h-64 object-cover rounded-lg"
                  width={800}
                  height={256}
                />
              </figure>
            )}
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-semibold mb-2">Details</h4>
                <p className="text-sm">Servings: {selectedRecipe.servings || 'N/A'}</p>
                <p className="text-sm">Prep: {formatTime(selectedRecipe.prepTime)}</p>
                <p className="text-sm">Cook: {formatTime(selectedRecipe.cookTime)}</p>
                <p className="text-sm">Total: {formatTime(selectedRecipe.totalTime)}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedRecipe.category?.map(cat => (
                    <span key={cat} className="badge badge-sm badge-primary">
                      {cat.replace(/_/g, ' ')}
                    </span>
                  ))}
                  {selectedRecipe.dietaryTags?.map(tag => (
                    <span key={tag} className="badge badge-sm badge-success">
                      {tag.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Ingredients ({selectedRecipe.ingredients.length})</h4>
              <ul className="text-sm list-disc list-inside">
                {selectedRecipe.ingredients.slice(0, 8).map(ing => (
                  <li key={ing.id}>
                    {ing.quantity && `${ing.quantity} `}
                    {ing.unit && `${ing.unit} `}
                    {ing.ingredientName}
                  </li>
                ))}
                {selectedRecipe.ingredients.length > 8 && (
                  <li className="opacity-70">... and {selectedRecipe.ingredients.length - 8} more</li>
                )}
              </ul>
            </div>

            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedRecipe(null)}>Close</button>
              <Link 
                href={`/application/recipes/${selectedRecipe.id}`}
                className="btn btn-primary"
              >
                View Full Recipe
              </Link>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setSelectedRecipe(null)}>close</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;