'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface InventoryItem {
  id: string;
  item_name: string;
  item_id: string;
  quantity: number;
}

interface InventoryInterfaceProps {
  onItemAdded?: (itemId: string, quantity: number) => void;
}

export function InventoryInterface({ onItemAdded }: InventoryInterfaceProps) {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .gt('quantity', 0) // Only show items with stock
        .order('item_name');

      if (error) {
        throw error;
      }

      setInventoryItems(data || []);
      
      // Initialize quantities to 0 for all items
      const initialQuantities: Record<string, number> = {};
      data?.forEach(item => {
        initialQuantities[item.id] = 0;
      });
      setQuantities(initialQuantities);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inventory items');
    } finally {
      setLoading(false);
    }
  };

  const incrementQuantity = (itemId: string) => {
    const item = inventoryItems.find(i => i.id === itemId);
    if (!item) return;

    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.min((prev[itemId] || 0) + 1, item.quantity)
    }));
  };

  const decrementQuantity = (itemId: string) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) - 1)
    }));
  };

  const handleAddToCart = (itemId: string) => {
    const quantity = quantities[itemId];
    if (quantity > 0 && onItemAdded) {
      onItemAdded(itemId, quantity);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-4">📦</div>
          <p className="text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
        <p className="font-medium">Error loading inventory</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Browse Inventory</h2>
        <p className="text-muted-foreground">
          Add individual items to your cart
        </p>
      </div>
      
      {inventoryItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-bold mb-2">No items available</h3>
          <p className="text-muted-foreground">
            Check back later for new inventory
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventoryItems.map((item) => (
            <div key={item.id} className="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-3">{item.item_name}</h3>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">
                    Available: {item.quantity}
                  </span>
                  <span className="text-xs bg-muted px-2 py-1 rounded">
                    ID: {item.item_id}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => decrementQuantity(item.id)}
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors disabled:opacity-50"
                      disabled={quantities[item.id] === 0}
                    >
                      -
                    </button>
                    
                    <span className="w-12 text-center font-semibold">
                      {quantities[item.id] || 0}
                    </span>
                    
                    <button
                      onClick={() => incrementQuantity(item.id)}
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors disabled:opacity-50"
                      disabled={quantities[item.id] >= item.quantity}
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantities[item.id] === 0}
                    onClick={() => handleAddToCart(item.id)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}