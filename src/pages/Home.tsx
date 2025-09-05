import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Leaf, Star, Award, Recycle } from 'lucide-react';
import { products, searchProducts } from '@/data/products';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-grocery.jpg';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const { addToCart, getTotalItems } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const results = searchProducts(query);
    setFilteredProducts(results);
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast({
      title: "Added to cart! 🌱",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={heroImage}
          alt="Fresh organic groceries"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-primary/20" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-playfair font-bold text-white">EcoGrocer</h1>
          </div>
          <p className="text-white/90 text-sm max-w-xs">
            Fresh, organic groceries for conscious living
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="p-6 -mt-8 relative z-10">
        <div className="bg-card rounded-lg shadow-eco p-4 mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Star className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Premium Quality</p>
          </div>
          <div className="text-center">
            <div className="bg-accent/10 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Award className="h-5 w-5 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground">Certified Organic</p>
          </div>
          <div className="text-center">
            <div className="bg-success/10 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
              <Recycle className="h-5 w-5 text-success" />
            </div>
            <p className="text-xs text-muted-foreground">Eco Packaging</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-6">
          <Button
            variant="eco"
            onClick={() => navigate('/kitchen')}
            className="flex-1 gap-2"
          >
            <Leaf className="h-4 w-4" />
            My Kitchen
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/cart')}
            className="gap-2"
          >
            Cart ({getTotalItems()})
          </Button>
        </div>

        {/* Products Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              {searchQuery ? `Results for "${searchQuery}"` : 'Fresh Picks'}
            </h2>
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSearch('')}
              >
                Clear
              </Button>
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No products found</p>
              <Button
                variant="outline"
                onClick={() => handleSearch('')}
                className="mt-2"
              >
                View All Products
              </Button>
            </div>
          )}
        </div>
      </div>

      <Navigation cartItemCount={getTotalItems()} />
    </div>
  );
};

export default Home;