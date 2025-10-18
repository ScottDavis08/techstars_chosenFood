// Food Bank Recipe Management System - Data Models

// Recipe Information
export interface Recipe {
  id: string;
  title: string;
  ingredients: RecipeIngredient[];
  directions: string[];
  link?: string;
  servings?: number;
  prepTime?: number; // minutes
  cookTime?: number; // minutes
  totalTime?: number; // minutes
  category?: RecipeCategory[];
  dietaryTags?: DietaryTag[];
  nutrition?: NutritionInfo;
  image?: RecipeImage;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export enum RecipeCategory {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  SNACK = 'SNACK',
  DESSERT = 'DESSERT',
  SIDE_DISH = 'SIDE_DISH',
  SOUP = 'SOUP',
  SALAD = 'SALAD',
  BEVERAGE = 'BEVERAGE'
}

export enum DietaryTag {
  VEGETARIAN = 'VEGETARIAN',
  VEGAN = 'VEGAN',
  GLUTEN_FREE = 'GLUTEN_FREE',
  DAIRY_FREE = 'DAIRY_FREE',
  NUT_FREE = 'NUT_FREE',
  LOW_SODIUM = 'LOW_SODIUM',
  LOW_SUGAR = 'LOW_SUGAR',
  HIGH_PROTEIN = 'HIGH_PROTEIN',
  HEART_HEALTHY = 'HEART_HEALTHY',
  DIABETIC_FRIENDLY = 'DIABETIC_FRIENDLY'
}

// Recipe Ingredient (links recipe to USDA food)
export interface RecipeIngredient {
  id: string;
  recipeId: string;
  usdaFoodId?: string; // Reference to USDA food database
  ingredientName: string; // Raw text from recipe
  quantity?: number;
  unit?: string;
  preparation?: string; // e.g., "chopped", "diced", "cooked"
  notes?: string;
  sortOrder: number;
}

// USDA Food Database Entry
export interface USDAFood {
  id: string; // USDA FDC ID
  fdcId: number;
  description: string;
  dataType: USDADataType;
  foodCategory?: string;
  nutrients: USDANutrient[];
  portions?: USDAFoodPortion[];
  ingredients?: string; // For branded foods
  brandOwner?: string;
  brandName?: string;
  gtinUpc?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  householdServingFullText?: string;
}

export enum USDADataType {
  FOUNDATION = 'FOUNDATION',
  SR_LEGACY = 'SR_LEGACY',
  SURVEY = 'SURVEY',
  BRANDED = 'BRANDED'
}

export interface USDANutrient {
  nutrientId: number;
  nutrientName: string;
  nutrientNumber: string;
  unitName: string;
  value: number;
  rank?: number;
}

export interface USDAFoodPortion {
  id: number;
  amount: number;
  measureUnit: string;
  modifier?: string;
  gramWeight: number;
}

// Nutrition Information (aggregated for recipe)
export interface NutritionInfo {
  servingSize: string;
  servings: number;
  calories?: number;
  totalFat?: number;
  saturatedFat?: number;
  transFat?: number;
  cholesterol?: number;
  sodium?: number;
  totalCarbohydrates?: number;
  dietaryFiber?: number;
  totalSugars?: number;
  protein?: number;
  vitaminD?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
}

// Recipe Image
export interface RecipeImage {
  id: string;
  recipeId: string;
  url: string;
  storageKey: string;
  thumbnail?: string;
  caption?: string;
  uploadedAt: string;
  uploadedBy: string;
  metadata: ImageMetadata;
}

export interface ImageMetadata {
  fileName: string;
  fileSize: number;
  width: number;
  height: number;
  format: string;
}

// Food Bank Client Information
export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: Address;
  householdSize: number;
  dietaryRestrictions?: DietaryTag[];
  allergies?: string[];
  preferredLanguage?: string;
  registrationDate: string;
  lastVisit?: string;
  status: ClientStatus;
}

export enum ClientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING'
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Ingredient Inventory
export interface InventoryItem {
  id: string;
  usdaFoodId?: string;
  name: string;
  quantity: number;
  unit: string;
  category?: string;
  expirationDate?: string;
  location?: string;
  supplier?: string;
  cost?: number;
  lastRestocked?: string;
  minStockLevel?: number;
  status: InventoryStatus;
}

export enum InventoryStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  EXPIRED = 'EXPIRED'
}

// Recipe Collections/Meal Plans
export interface RecipeCollection {
  id: string;
  name: string;
  description?: string;
  recipeIds: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  tags?: string[];
}

// User/Staff Information
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
  lastLogin?: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  VOLUNTEER = 'VOLUNTEER',
  VIEWER = 'VIEWER'
}

// Search and Filter Options
export interface RecipeSearchParams {
  query?: string;
  categories?: RecipeCategory[];
  dietaryTags?: DietaryTag[];
  ingredients?: string[];
  maxPrepTime?: number;
  minRating?: number;
}

export interface IngredientMatch {
  recipeIngredientName: string;
  usdaFoodId?: string;
  usdaFoodDescription?: string;
  confidence: number; // 0-1, for AI matching
  manuallyVerified: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  pagination?: Pagination;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Input types for creating/updating entities
export type CreateRecipeInput = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRecipeInput = Partial<Omit<Recipe, 'id' | 'createdAt'>>;
