import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Add this line to force dynamic rendering
export const dynamic = 'force-dynamic';

console.log('🔧 Initializing Supabase client for inventory...');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  console.log('\n📦 === INVENTORY SYNC API CALLED ===');
  console.log('⏰ Timestamp:', new Date().toISOString());
  
  try {
    console.log('📥 Parsing inventory request body...');
    const inventory = await request.json();
    console.log('📊 Raw inventory data:', JSON.stringify(inventory, null, 2));

    if (!Array.isArray(inventory)) {
      console.log('❌ Error: Expected array but received:', typeof inventory);
      return NextResponse.json(
        { error: 'Expected an array of inventory items' },
        { status: 400 }
      );
    }

    console.log(`✅ Received ${inventory.length} inventory items to sync`);

    // First, clear existing inventory
    console.log('🗑️ Clearing existing inventory...');
    const { error: deleteError } = await supabase
      .from('inventory_items')
      .delete()
      .neq('id', 0); // Delete all rows

    if (deleteError) {
      console.log('💥 Error clearing inventory:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    console.log('✅ Existing inventory cleared');

    const formattedInventory = inventory.map((item: any, index: number) => {
      console.log(`🔄 Formatting inventory item ${index + 1}:`, item.item_name);
      return {
        item_id: item.item_id,
        item_name: item.item_name,
        quantity: item.quantity || 0,
      };
    });

    console.log('📝 Formatted inventory for database:', JSON.stringify(formattedInventory, null, 2));
    console.log('🔗 Attempting Supabase insert...');

    const { data, error } = await supabase
      .from('inventory_items')
      .insert(formattedInventory)
      .select();

    if (error) {
      console.log('💥 Supabase error occurred:');
      console.log('   - Error code:', error.code);
      console.log('   - Error message:', error.message);
      console.log('   - Error details:', error.details);
      console.log('   - Error hint:', error.hint);
      
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('🎉 Inventory sync successful!');
    console.log('📈 Synced data:', JSON.stringify(data, null, 2));
    console.log(`✨ Successfully synced ${data?.length || 0} inventory items`);

    const response = {
      success: true,
      count: data?.length || 0,
      items: data,
    };

    console.log('📤 Sending response:', JSON.stringify(response, null, 2));
    console.log('🏁 === INVENTORY SYNC COMPLETED ===\n');

    return NextResponse.json(response);
  } catch (error) {
    console.log('💥 Unexpected error in inventory sync:');
    console.log('   - Error type:', typeof error);
    console.log('   - Error message:', error instanceof Error ? error.message : String(error));
    console.log('   - Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { error: 'Failed to sync inventory' },
      { status: 500 }
    );
  }
}

export async function GET() {
  console.log('\n📦 === INVENTORY GET API CALLED ===');
  console.log('⏰ Timestamp:', new Date().toISOString());
  
  try {
    console.log('🔍 Fetching current inventory...');
    
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('item_name');

    if (error) {
      console.log('💥 Supabase error occurred:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`✅ Found ${data?.length || 0} inventory items`);
    console.log('📊 Inventory data:', JSON.stringify(data, null, 2));

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      items: data,
    });
  } catch (error) {
    console.log('💥 Unexpected error fetching inventory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}
