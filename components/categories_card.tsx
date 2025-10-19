import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Filter } from 'lucide-react';

interface CategorySelectionProps {
  onContinue: (selectedCategories: string[]) => void;
}

export function CategorySelection({ onContinue }: CategorySelectionProps) {
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState<string[]>([]);
  const [selectedMealType, setSelectedMealType] = useState<string[]>([]);

  const allergenConditions = [
    { id: 'peanut', label: 'Peanut ', icon: '🥜' },
    { id: 'tree-nut', label: 'Tree Nut ', icon: '🌰' },
    { id: 'shellfish', label: 'Shellfish ', icon: '🦐' },
    { id: 'dairy', label: 'Dairy ', icon: '🥛' },
    { id: 'egg', label: 'Egg ', icon: '🥚' },
    { id: 'soy', label: 'Soy ', icon: '🫘' },
    { id: 'wheat', label: 'Wheat ', icon: '🌾' },
    { id: 'fish', label: 'Fish ', icon: '🐟' },
  ];

  const dietaryPreferences = [
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
    { id: 'vegan', label: 'Vegan', icon: '🌱' },
    { id: 'gluten-free', label: 'Gluten Free', icon: '🌾' },
    { id: 'low-carb', label: 'Low Carb', icon: '🥩' },
  ];

  const cuisineTypes = [
    { id: 'italian', label: 'Italian', icon: '🍝' },
    { id: 'mexican', label: 'Mexican', icon: '🌮' },
    { id: 'asian', label: 'Asian', icon: '🍜' },
    { id: 'american', label: 'American', icon: '🍔' },
    { id: 'mediterranean', label: 'Mediterranean', icon: '🫒' },
    { id: 'indian', label: 'Indian', icon: '🍛' },
  ];

  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', icon: '🍳' },
    { id: 'lunch', label: 'Lunch', icon: '🥪' },
    { id: 'dinner', label: 'Dinner', icon: '🍽️' },
    { id: 'snack', label: 'Snack', icon: '🍿' },
    { id: 'dessert', label: 'Dessert', icon: '🍰' },
  ];

  const toggleCategory = (
    category: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selected.includes(category)) {
      setSelected(selected.filter(c => c !== category));
    } else {
      setSelected([...selected, category]);
    }
  };

  const handleContinue = () => {
    const allSelected = [
      ...selectedAllergens,
      ...selectedDietary,
      ...selectedCuisine,
      ...selectedMealType,
    ];
    onContinue(allSelected);
  };

  const totalSelected = selectedAllergens.length + selectedDietary.length + selectedCuisine.length + selectedMealType.length;

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🍽️</div>
        <h2 className="text-3xl font-bold mb-2">Choose Your Preferences</h2>
        <p className="text-muted-foreground">
          Select dietary needs, cuisine types, and meal preferences to find perfect recipes
        </p>
        {totalSelected > 0 && (
          <Badge variant="secondary" className="mt-3 text-lg px-4 py-2">
            <Filter className="h-4 w-4 mr-2" />
            {totalSelected} filter{totalSelected !== 1 ? 's' : ''} selected
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            Allergies
          </CardTitle>
          <CardDescription>
            Select any allergies or health conditions that require dietary modifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {allergenConditions.map((condition) => (
              <div
                key={condition.id}
                onClick={() => toggleCategory(condition.id, selectedAllergens, setSelectedAllergens)}
                className={`
                  flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${selectedAllergens.includes(condition.id)
                    ? 'border-red-500 bg-red-50 shadow-md'
                    : 'border-border hover:border-red-300 hover:bg-accent/50'
                  }
                `}
              >
                <Checkbox
                  checked={selectedAllergens.includes(condition.id)}
                  onCheckedChange={() => {}}
                  className="pointer-events-none"
                />
                <span className="text-2xl">{condition.icon}</span>
                <span className="font-medium">{condition.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🥗</span>
            Dietary Preferences
          </CardTitle>
          <CardDescription>
            Select any dietary restrictions or preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {dietaryPreferences.map((pref) => (
              <div
                key={pref.id}
                onClick={() => toggleCategory(pref.id, selectedDietary, setSelectedDietary)}
                className={`
                  flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${selectedDietary.includes(pref.id)
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-border hover:border-primary/50 hover:bg-accent/50'
                  }
                `}
              >
                <Checkbox
                  checked={selectedDietary.includes(pref.id)}
                  onCheckedChange={() => {}}
                  className="pointer-events-none"
                />
                <span className="text-2xl">{pref.icon}</span>
                <span className="font-medium">{pref.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🌍</span>
            Cuisine Type
          </CardTitle>
          <CardDescription>
            Pick your favorite cuisines (optional)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {cuisineTypes.map((cuisine) => (
              <div
                key={cuisine.id}
                onClick={() => toggleCategory(cuisine.id, selectedCuisine, setSelectedCuisine)}
                className={`
                  flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${selectedCuisine.includes(cuisine.id)
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-border hover:border-primary/50 hover:bg-accent/50'
                  }
                `}
              >
                <Checkbox
                  checked={selectedCuisine.includes(cuisine.id)}
                  onCheckedChange={() => {}}
                  className="pointer-events-none"
                />
                <span className="text-2xl">{cuisine.icon}</span>
                <span className="font-medium">{cuisine.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">⏰</span>
            Meal Type
          </CardTitle>
          <CardDescription>
            What are you looking to make?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {mealTypes.map((meal) => (
              <div
                key={meal.id}
                onClick={() => toggleCategory(meal.id, selectedMealType, setSelectedMealType)}
                className={`
                  flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${selectedMealType.includes(meal.id)
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-border hover:border-primary/50 hover:bg-accent/50'
                  }
                `}
              >
                <Checkbox
                  checked={selectedMealType.includes(meal.id)}
                  onCheckedChange={() => {}}
                  className="pointer-events-none"
                />
                <span className="text-2xl">{meal.icon}</span>
                <span className="font-medium">{meal.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            setSelectedAllergens([]);
            setSelectedDietary([]);
            setSelectedCuisine([]);
            setSelectedMealType([]);
          }}
          disabled={totalSelected === 0}
        >
          Clear All Filters
        </Button>
        <Button
          size="lg"
          onClick={handleContinue}
          className="w-full sm:w-auto"
        >
          Continue to Recipes
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

export default CategorySelection;