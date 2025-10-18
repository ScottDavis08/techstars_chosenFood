import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Add this line to force dynamic rendering
export const dynamic = 'force-dynamic';

console.log('🔧 Initializing Supabase client...');
console.log('📍 SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('🔑 ANON_KEY (first 20 chars):', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  console.log('\n🚀 === RECIPE IMPORT API CALLED ===');
  console.log('⏰ Timestamp:', new Date().toISOString());
  
  try {
    console.log('📥 Parsing request body...');
    const recipes = await request.json();
    console.log('📊 Raw request data:', JSON.stringify(recipes, null, 2));

    if (!Array.isArray(recipes)) {
      console.log('❌ Error: Expected array but received:', typeof recipes);
      return NextResponse.json(
        { error: 'Expected an array of recipes' },
        { status: 400 }
      );
    }

    console.log(`✅ Received ${recipes.length} recipes to import`);

    const formattedRecipes = recipes.map((recipe: any, index: number) => {
      console.log(`🔄 Formatting recipe ${index + 1}:`, recipe.title);
      return {
        title: recipe.title,
        ingredients: recipe.ingredients || [],
        directions: recipe.directions || [],
        link: recipe.link || null,
        source: recipe.source || 'Imported',
        image_url: recipe.image_url || null,
      };
    });

    console.log('📝 Formatted recipes for database:', JSON.stringify(formattedRecipes, null, 2));
    console.log('🔗 Attempting Supabase insert...');

    const { data, error } = await supabase
      .from('recipes')
      .insert(formattedRecipes)
      .select();

    if (error) {
      console.log('💥 Supabase error occurred:');
      console.log('   - Error code:', error.code);
      console.log('   - Error message:', error.message);
      console.log('   - Error details:', error.details);
      console.log('   - Error hint:', error.hint);
      
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('🎉 Insert successful!');
    console.log('📈 Inserted data:', JSON.stringify(data, null, 2));
    console.log(`✨ Successfully imported ${data?.length || 0} recipes`);

    const response = {
      success: true,
      count: data?.length || 0,
      recipes: data,
    };

    console.log('📤 Sending response:', JSON.stringify(response, null, 2));
    console.log('🏁 === RECIPE IMPORT COMPLETED ===\n');

    return NextResponse.json(response);
  } catch (error) {
    console.log('💥 Unexpected error in recipe import:');
    console.log('   - Error type:', typeof error);
    console.log('   - Error message:', error instanceof Error ? error.message : String(error));
    console.log('   - Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { error: 'Failed to import recipes' },
      { status: 500 }
    );
  }
}
