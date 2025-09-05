import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import Navigation from '@/components/Navigation';
import QuantitySelector from '@/components/QuantitySelector';
import { Plus, ArrowLeft, Search, AlertTriangle, ShoppingCart, Coffee, Calendar, Clock } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { KitchenItem } from '@/types';

const MyKitchen = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [kitchenItems, setKitchenItems] = useState<KitchenItem[]>([
    {
      id: '1',
      name: 'Rice',
      quantity: 2,
      unit: 'cups',
      category: 'daily',
      lastUpdated: new Date()
    },
    {
      id: '2',
      name: 'Milk',
      quantity: 1,
      unit: 'bottle',
      category: 'weekly',
      lastUpdated: new Date()
    }
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [showAddItem, setShowAddItem] = useState<{[key: string]: boolean}>({});
  const { addToCart, getTotalItems } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const getFilteredItems = (category: string) => {
    return kitchenItems.filter(item => item.category === category);
  };

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    setKitchenItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity, lastUpdated: new Date() }
          : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setKitchenItems(prev => prev.filter(item => item.id !== itemId));
  };

  const addNewItem = (category: string) => {
    if (!newItemName.trim()) return;
    
    const newItem: KitchenItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      quantity: 1,
      unit: 'item',
      category: category as 'daily' | 'weekly' | 'monthly',
      lastUpdated: new Date()
    };
    
    setKitchenItems(prev => [...prev, newItem]);
    setNewItemName('');
    setShowAddItem(prev => ({ ...prev, [category]: false }));
    
    toast({
      title: "Item added! 🏠",
      description: `${newItem.name} has been added to your ${category} list.`,
    });
  };

  const addAllToCart = () => {
    const currentItems = getFilteredItems(activeTab);
    if (currentItems.length === 0) return;

    // Mock products based on kitchen items (in real app, you'd match with actual products)
    currentItems.forEach(item => {
      const mockProduct = {
        id: `mock-${item.id}`,
        name: item.name,
        price: 4.99, // Mock price
        image: '/placeholder.svg' // Would be actual image
      };
      addToCart(mockProduct, item.quantity);
    });

    const total = currentItems.reduce((sum, item) => sum + (4.99 * item.quantity), 0);
    
    toast({
      title: "Added to cart! 🛒",
      description: `${currentItems.length} items added - Total: $${total.toFixed(2)}`,
    });
  };

  // Mock AI notification (would be real in production)
  const showAINotification = () => {
    toast({
      title: "⚠️ Kitchen Alert",
      description: "You'll run out of Rice in 2 days. Add to cart?",
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            addToCart({ id: 'rice-refill', name: 'Brown Rice (Organic)', price: 8.99, image: '/placeholder.svg' });
            toast({ title: "Rice added to cart! 🌾" });
          }}
        >
          Add Rice
        </Button>
      ),
    });
  };

  const TabContent = ({ category }: { category: string }) => {
    const items = getFilteredItems(category);
    const isEmpty = items.length === 0;

    return (
      <div className="space-y-4">
        {/* AI Alert Demo */}
        {category === 'daily' && (
          <Card className="border-warning/20 bg-warning/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">AI Kitchen Assistant</p>
                  <p className="text-xs text-muted-foreground">Smart predictions based on your usage</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={showAINotification}
                  className="text-xs"
                >
                  Check Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Item */}
        <Card className="border-dashed border-primary/30">
          <CardContent className="p-4">
            {showAddItem[category] ? (
              <div className="flex gap-2">
                <Input
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Enter item name..."
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && addNewItem(category)}
                />
                <Button
                  variant="eco"
                  size="sm"
                  onClick={() => addNewItem(category)}
                  disabled={!newItemName.trim()}
                >
                  Add
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddItem(prev => ({ ...prev, [category]: false }))}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                onClick={() => setShowAddItem(prev => ({ ...prev, [category]: true }))}
                className="w-full border-2 border-dashed border-primary/30 hover:border-primary/50 text-primary gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Item (+)
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Items List */}
        {isEmpty ? (
          <div className="text-center py-12">
            <div className="bg-muted rounded-full p-6 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              Looking for something? Your list is empty.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.unit}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <QuantitySelector
                          quantity={item.quantity}
                          onIncrease={() => updateItemQuantity(item.id, item.quantity + 1)}
                          onDecrease={() => updateItemQuantity(item.id, item.quantity - 1)}
                          min={0}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2"
                        >
                          Remove (–)
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add to Cart Button */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <Button
                  variant="eco"
                  onClick={addAllToCart}
                  className="w-full gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add All to Cart
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {items.length} items • Estimated: $
                  {(items.reduce((sum, item) => sum + (4.99 * item.quantity), 0)).toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground">My Kitchen</h1>
            <p className="text-sm text-muted-foreground">Manage your essentials</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="daily" className="gap-1">
              <Coffee className="h-4 w-4" />
              Daily
            </TabsTrigger>
            <TabsTrigger value="weekly" className="gap-1">
              <Calendar className="h-4 w-4" />
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="gap-1">
              <Clock className="h-4 w-4" />
              Monthly
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            <TabContent category="daily" />
          </TabsContent>
          
          <TabsContent value="weekly">
            <TabContent category="weekly" />
          </TabsContent>
          
          <TabsContent value="monthly">
            <TabContent category="monthly" />
          </TabsContent>
        </Tabs>
      </div>

      <Navigation cartItemCount={getTotalItems()} />
    </div>
  );
};

export default MyKitchen;