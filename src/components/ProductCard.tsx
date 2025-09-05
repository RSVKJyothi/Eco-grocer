import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Plus } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  onAddToCart: (product: { id: string; name: string; price: number; image: string }) => void;
}

const ProductCard = ({ id, name, price, image, onAddToCart }: ProductCardProps) => {
  const handleAddToCart = () => {
    onAddToCart({ id, name, price, image });
  };

  return (
    <Card className="group hover:shadow-eco transition-all duration-300 border-border/20 bg-card overflow-hidden">
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">${price.toFixed(2)}</span>
          <Button
            variant="eco"
            size="sm"
            onClick={handleAddToCart}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;