import { useState } from 'react';
import {
  RecipeCategory,
  DietaryTag,
  CreateRecipeInput,
  RecipeIngredient
} from '@/types';

export interface RecipeFormState {
  title: string;
  servings: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  description: string;
  category: RecipeCategory[];
  dietaryTags: DietaryTag[];
  link: string;
}

export interface IngredientFormState {
  ingredientName: string;
  quantity: string;
  unit: string;
  preparation: string;
  notes: string;
}

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  preview: string;
}

export function useFormData() {
  const [recipe, setRecipe] = useState<RecipeFormState>({
    title: '',
    servings: '',
    prepTime: '',
    cookTime: '',
    totalTime: '',
    description: '',
    category: [],
    dietaryTags: [],
    link: ''
  });

  const [ingredients, setIngredients] = useState<IngredientFormState[]>([
    { ingredientName: '', quantity: '', unit: '', preparation: '', notes: '' }
  ]);

  const [directions, setDirections] = useState<string[]>(['']);
  
  const [image, setImage] = useState<UploadedFile | null>(null);

  // Recipe handlers
  const handleRecipeChange = (field: string, value: string | string[]): void => {
    setRecipe(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleCategory = (category: RecipeCategory): void => {
    setRecipe(prev => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category]
    }));
  };

  const toggleDietaryTag = (tag: DietaryTag): void => {
    setRecipe(prev => ({
      ...prev,
      dietaryTags: prev.dietaryTags.includes(tag)
        ? prev.dietaryTags.filter(t => t !== tag)
        : [...prev.dietaryTags, tag]
    }));
  };

  // Ingredient handlers
  const handleIngredientChange = (index: number, field: keyof IngredientFormState, value: string): void => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const addIngredient = (): void => {
    setIngredients([...ingredients, { ingredientName: '', quantity: '', unit: '', preparation: '', notes: '' }]);
  };

  const removeIngredient = (index: number): void => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Direction handlers
  const handleDirectionChange = (index: number, value: string): void => {
    const updated = [...directions];
    updated[index] = value;
    setDirections(updated);
  };

  const addDirection = (): void => {
    setDirections([...directions, '']);
  };

  const removeDirection = (index: number): void => {
    setDirections(directions.filter((_, i) => i !== index));
  };

  // Image handler
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const processedFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        preview: URL.createObjectURL(file)
      };
      setImage(processedFile);
    }
  };

  const removeImage = (): void => {
    if (image) {
      URL.revokeObjectURL(image.preview);
      setImage(null);
    }
  };

  // Auto-calculate total time
  const updateTotalTime = (): void => {
    const prep = parseInt(recipe.prepTime) || 0;
    const cook = parseInt(recipe.cookTime) || 0;
    const total = prep + cook;
    if (total > 0) {
      setRecipe(prev => ({ ...prev, totalTime: total.toString() }));
    }
  };

  const handleSubmit = (): void => {
    // Calculate total time if not set
    const prep = parseInt(recipe.prepTime) || 0;
    const cook = parseInt(recipe.cookTime) || 0;
    const total = recipe.totalTime ? parseInt(recipe.totalTime) : prep + cook;

    // Transform form data to match API types
    const recipeData: Partial<CreateRecipeInput> = {
      title: recipe.title,
      servings: recipe.servings ? parseInt(recipe.servings) : undefined,
      prepTime: recipe.prepTime ? parseInt(recipe.prepTime) : undefined,
      cookTime: recipe.cookTime ? parseInt(recipe.cookTime) : undefined,
      totalTime: total || undefined,
      category: recipe.category.length > 0 ? recipe.category : undefined,
      dietaryTags: recipe.dietaryTags.length > 0 ? recipe.dietaryTags : undefined,
      link: recipe.link || undefined,
      ingredients: ingredients
        .filter(ing => ing.ingredientName.trim() !== '')
        .map((ing, index) => ({
          id: Math.random().toString(36).substr(2, 9),
          recipeId: '', // Will be set by server
          ingredientName: ing.ingredientName,
          quantity: ing.quantity ? parseFloat(ing.quantity) : undefined,
          unit: ing.unit || undefined,
          preparation: ing.preparation || undefined,
          notes: ing.notes || undefined,
          sortOrder: index
        })),
      directions: directions.filter(dir => dir.trim() !== ''),
      image: image ? {
        id: image.id,
        recipeId: '', // Will be set by server
        url: '', // Will be set after upload
        storageKey: '', // Will be set after upload
        caption: recipe.title,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'current-user', // Replace with actual user
        metadata: {
          fileName: image.file.name,
          fileSize: image.file.size,
          width: 0, // Would come from actual image metadata
          height: 0,
          format: image.file.type.split('/')[1] || 'jpeg'
        }
      } : undefined
    };

    const formData = {
      recipe: recipeData,
      imageFile: image?.file
    };
    
    console.log('Form submission:', formData);
    alert('Recipe submitted successfully! Check console for data.');
  };

  return {
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
  };
}