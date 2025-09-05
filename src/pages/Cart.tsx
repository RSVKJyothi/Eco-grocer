import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import QuantitySelector from '@/components/QuantitySelector';
import { ShoppingCart, Trash2, CreditCard, ArrowLeft } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    toast({
      title: "Order placed! 🎉",
      description: `Your order of $${getTotalPrice().toFixed(2)} has been confirmed.`,
    });
    
    clearCart();
    navigate('/');
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast({
      title: "Item removed",
      description: `${productName} has been removed from your cart.`,
    });
  };

  if (cartItems.length === 0) {
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
            <h1 className="text-xl font-semibold text-foreground">Shopping Cart</h1>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-muted rounded-full p-8 mb-6">
              <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              🛒 Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xs">
              Discover fresh, organic groceries and add them to your cart
            </p>
            <Button
              variant="eco"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              Start Shopping
            </Button>
          </div>
        </div>
        <Navigation cartItemCount={getTotalItems()} />
      </div>
    );
  }

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
          <h1 className="text-xl font-semibold text-foreground">Shopping Cart</h1>
          <span className="text-sm text-muted-foreground">({getTotalItems()} items)</span>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {cartItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)} each
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <QuantitySelector
                        quantity={item.quantity}
                        onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                        onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                        min={1}
                      />
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id, item.name)}
                          className="p-1 h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Total & Checkout */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-foreground">Total</span>
              <span className="text-2xl font-bold text-primary">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>
            <Button
              variant="eco"
              size="lg"
              onClick={handleCheckout}
              className="w-full gap-2"
            >
              <CreditCard className="h-5 w-5" />
              Checkout
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Secure payment • Free eco-friendly packaging
            </p>
          </CardContent>
        </Card>
      </div>

      <Navigation cartItemCount={getTotalItems()} />
    </div>
  );
};

export default Cart;