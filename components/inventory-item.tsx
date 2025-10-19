'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  image_url?: string;
}

export default function InventoryPage() {
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
        .order('name');

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

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, newQuantity)
    }));
  };

  const incrementQuantity = (itemId: string) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const decrementQuantity = (itemId: string) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) - 1)
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading inventory...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Inventory</h1>
      
      {inventoryItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No inventory items available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventoryItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden border">
              {item.image_url && (
                <img 
                  src={item.image_url} 
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                
                {item.description && (
                  <p className="text-gray-600 mb-3">{item.description}</p>
                )}
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-green-600">
                    ${item.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    Stock: {item.stock_quantity}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => decrementQuantity(item.id)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                      disabled={quantities[item.id] === 0}
                    >
                      -
                    </button>
                    
                    <span className="w-12 text-center font-semibold">
                      {quantities[item.id] || 0}
                    </span>
                    
                    <button
                      onClick={() => incrementQuantity(item.id)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                      disabled={quantities[item.id] >= item.stock_quantity}
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                    disabled={quantities[item.id] === 0}
                    onClick={() => {
                      // TODO: Add to cart functionality will be implemented later
                      console.log(`Add ${quantities[item.id]} of ${item.name} to cart`);
                    }}
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