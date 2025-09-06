import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import Navigation from '@/components/Navigation';
import QuantitySelector from '@/components/QuantitySelector';
import { Plus, ArrowLeft, Search, AlertTriangle, ShoppingCart, Coffee, Calendar, Clock, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { KitchenItem } from '@/types';
import { useNotifications } from '@/hooks/useNotifications';

const MyKitchen = () => {
  const [activeTab, setActiveTab] = useState('daily');
  const [kitchenItems, setKitchenItems] = useState<KitchenItem[]>([
    // Daily items
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
      name: 'Tea',
      quantity: 1,
      unit: 'cups',
      category: 'daily',
      lastUpdated: new Date()
    },
    // Weekly items
    {
      id: '3',
      name: 'Oil',
      quantity: 1,
      unit: 'bottles',
      category: 'weekly',
      lastUpdated: new Date()
    },
    {
      id: '4',
      name: 'Pulses',
      quantity: 3,
      unit: 'cups',
      category: 'weekly',
      lastUpdated: new Date()
    },
    // Monthly items (based on CSV data)
    {
      id: '5',
      name: 'Rice',
      quantity: 5,
      unit: 'kg',
      category: 'monthly',
      lastUpdated: new Date()
    },
    {
      id: '6',
      name: 'Oil',
      quantity: 2,
      unit: 'l',
      category: 'monthly',
      lastUpdated: new Date()
    },
    {
      id: '7',
      name: 'Atta',
      quantity: 10,
      unit: 'kg',
      category: 'monthly',
      lastUpdated: new Date()
    },
    {
      id: '8',
      name: 'Pulses',
      quantity: 2,
      unit: 'kg',
      category: 'monthly',
      lastUpdated: new Date()
    },
    {
      id: '9',
      name: 'Sugar',
      quantity: 3,
      unit: 'kg',
      category: 'monthly',
      lastUpdated: new Date()
    },
    {
      id: '10',
      name: 'Tea',
      quantity: 1,
      unit: 'kg',
      category: 'monthly',
      lastUpdated: new Date()
    }
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [showAddItem, setShowAddItem] = useState<{[key: string]: boolean}>({});
  const { addToCart, getTotalItems } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { scheduleKitchenAlerts, triggerInstantAlert } = useNotifications();

  // Start notifications when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      scheduleKitchenAlerts();
    }, 2000); // Start after 2 seconds

    return () => clearTimeout(timer);
  }, [scheduleKitchenAlerts]);

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
    const itemToRemove = kitchenItems.find(item => item.id === itemId);
    setKitchenItems(prev => prev.filter(item => item.id !== itemId));
    
    if (itemToRemove) {
      toast({
        title: "Item removed! 🗑️",
        description: `${itemToRemove.name} has been removed from your ${itemToRemove.category} list.`,
      });
    }
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
    triggerInstantAlert('Rice');
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addNewItem(category);
                    }
                  }}
                  autoFocus
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
                  onClick={() => {
                    setNewItemName('');
                    setShowAddItem(prev => ({ ...prev, [category]: false }));
                  }}
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

        {/* Items List - Table Style to Match Mockup */}
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
            <Card>
              <CardContent className="p-0">
                {/* Table Header */}
                <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                  <span className="font-semibold text-foreground flex-1">Items</span>
                  <span className="font-semibold text-foreground w-24 text-center">Quantity</span>
                  <span className="font-semibold text-foreground w-20 text-center">Action</span>
                </div>
                
                {/* Table Items */}
                <div className="divide-y divide-border">
                  {items.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
                      <div className="flex-1 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">
                            {item.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            per {item.unit}
                          </p>
                        </div>
                      </div>
                      <div className="w-24 flex justify-center">
                        <QuantitySelector
                          quantity={item.quantity}
                          onIncrease={() => updateItemQuantity(item.id, item.quantity + 1)}
                          onDecrease={() => updateItemQuantity(item.id, item.quantity - 1)}
                          min={0}
                        />
                      </div>
                      <div className="w-20 flex justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="daily" className="gap-1 text-xs">
              <Coffee className="h-3 w-3" />
              Daily
            </TabsTrigger>
            <TabsTrigger value="weekly" className="gap-1 text-xs">
              <Calendar className="h-3 w-3" />
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="gap-1 text-xs">
              <Clock className="h-3 w-3" />
              Monthly
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="gap-1 text-xs">
              <AlertTriangle className="h-3 w-3" />
              Tips
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
          
          <TabsContent value="recommendations">
            <div className="space-y-4">
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Smart Recommendations</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Based on your purchase history, here are some predictions:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg border border-warning/20">
                      <div>
                        <p className="font-medium text-foreground">Rice</p>
                        <p className="text-xs text-muted-foreground">Usually purchased every 30 days</p>
                      </div>
                      <span className="text-xs text-warning font-medium">Due in 2 days</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg border border-accent/20">
                      <div>
                        <p className="font-medium text-foreground">Oil</p>
                        <p className="text-xs text-muted-foreground">Usually purchased every 30 days</p>
                      </div>
                      <span className="text-xs text-accent font-medium">Due in 1 week</span>
                    </div>
                  </div>
                  <Button
                    variant="eco"
                    size="sm"
                    onClick={showAINotification}
                    className="w-full mt-4"
                  >
                    Get More Insights
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Navigation cartItemCount={getTotalItems()} />
    </div>
  );
};

export default MyKitchen;