import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const recipes = await request.json();

    if (!Array.isArray(recipes)) {
      return NextResponse.json(
        { error: 'Expected an array of recipes' },
        { status: 400 }
      );
    }

    const formattedRecipes = recipes.map((recipe: any) => ({
      title: recipe.title,
      ingredients: recipe.ingredients || [],
      directions: recipe.directions || [],
      link: recipe.link || null,
      source: recipe.source || 'Imported',
      image_url: recipe.image_url || null,
    }));

    const { data, error } = await supabase
      .from('recipes')
      .insert(formattedRecipes)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      recipes: data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to import recipes' },
      { status: 500 }
    );
  }
}
