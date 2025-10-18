import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const inventory = await request.json();

    if (!Array.isArray(inventory)) {
      return NextResponse.json(
        { error: 'Expected an array of inventory items' },
        { status: 400 }
      );
    }

    await supabase.from('inventory_items').delete().neq('id', 0);

    const formattedItems = inventory.map((item: any) => ({
      item_id: item.item_id || item.id?.toString() || '',
      item_name: item.item_name || item.name || '',
      quantity: item.quantity || 0,
      last_synced: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from('inventory_items')
      .insert(formattedItems)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      items: data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to sync inventory' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('item_name');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}
