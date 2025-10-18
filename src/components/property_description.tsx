import { Recipe } from '@/types';

// Description Component
interface RecipeDescriptionProps {
  recipe: Recipe;
}

const RecipeDescription: React.FC<RecipeDescriptionProps> = ({ recipe }) => {
  const formatTime = (minutes: number | undefined) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes} mins`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recipe Information */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title text-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Recipe Details
          </h2>
          
          <div className="space-y-2">
            <div>
              <span className="font-medium">Title:</span>
              <p className="text-sm">{recipe.title}</p>
            </div>
            
            <div>
              <span className="font-medium">Servings:</span>
              <span className="ml-2 text-sm">{recipe.servings || 'N/A'}</span>
            </div>
            
            <div>
              <span className="font-medium">Prep Time:</span>
              <span className="ml-2 text-sm">{formatTime(recipe.prepTime)}</span>
            </div>
            
            <div>
              <span className="font-medium">Cook Time:</span>
              <span className="ml-2 text-sm">{formatTime(recipe.cookTime)}</span>
            </div>
            
            <div>
              <span className="font-medium">Total Time:</span>
              <span className="ml-2 text-sm">{formatTime(recipe.totalTime)}</span>
            </div>
            
            {recipe.category && recipe.category.length > 0 && (
              <div>
                <span className="font-medium">Categories:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {recipe.category.map((cat) => (
                    <span key={cat} className="badge badge-sm badge-primary">
                      {cat.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dietary Information */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title text-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Dietary Information
          </h2>
          
          <div className="space-y-2">
            {recipe.dietaryTags && recipe.dietaryTags.length > 0 ? (
              <div>
                <span className="font-medium">Dietary Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {recipe.dietaryTags.map((tag) => (
                    <span key={tag} className="badge badge-sm badge-success">
                      {tag.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm opacity-70">No dietary tags specified</p>
            )}
            
            {recipe.rating && (
              <div>
                <span className="font-medium">Rating:</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="rating rating-sm">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <input
                        key={star}
                        type="radio"
                        name="rating-display"
                        className="mask mask-star-2 bg-orange-400"
                        checked={star === Math.round(recipe.rating!)}
                        disabled
                      />
                    ))}
                  </div>
                  <span className="text-sm">({recipe.rating.toFixed(1)})</span>
                </div>
              </div>
            )}
            
            <div>
              <span className="font-medium">Created:</span>
              <span className="ml-2 text-sm">{formatDate(recipe.createdAt)}</span>
            </div>
            
            <div>
              <span className="font-medium">Last Updated:</span>
              <span className="ml-2 text-sm">{formatDate(recipe.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredients List */}
      <div className="card bg-base-100 shadow-md lg:col-span-2">
        <div className="card-body">
          <h2 className="card-title text-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Ingredients
          </h2>
          
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient.id} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span className="text-sm">
                  {ingredient.quantity && `${ingredient.quantity} `}
                  {ingredient.unit && `${ingredient.unit} `}
                  {ingredient.ingredientName}
                  {ingredient.preparation && `, ${ingredient.preparation}`}
                  {ingredient.notes && <span className="text-xs opacity-70"> ({ingredient.notes})</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Directions */}
      <div className="card bg-base-100 shadow-md lg:col-span-2">
        <div className="card-body">
          <h2 className="card-title text-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Directions
          </h2>
          
          <ol className="space-y-3">
            {recipe.directions.map((direction, index) => (
              <li key={index} className="flex gap-3">
                <span className="font-bold text-primary">{index + 1}.</span>
                <span className="text-sm leading-relaxed">{direction}</span>
              </li>
            ))}
          </ol>

          {recipe.link && (
            <div className="mt-4 pt-4 border-t border-base-300">
              <h3 className="font-medium text-sm mb-2">Original Recipe Link:</h3>
              <a 
                href={recipe.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="link link-primary text-sm"
              >
                {recipe.link}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDescription;