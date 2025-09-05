import { Button } from "@/components/ui/button";
import { Home, ShoppingCart, ChefHat, Leaf } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface NavigationProps {
  cartItemCount: number;
}

const Navigation = ({ cartItemCount }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/20 shadow-eco z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        <Button
          variant={isActive("/") ? "eco" : "ghost"}
          size="sm"
          onClick={() => navigate("/")}
          className="flex flex-col gap-1 h-auto py-2 px-3"
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </Button>

        <Button
          variant={isActive("/kitchen") ? "eco" : "ghost"}
          size="sm"
          onClick={() => navigate("/kitchen")}
          className="flex flex-col gap-1 h-auto py-2 px-3"
        >
          <ChefHat className="h-5 w-5" />
          <span className="text-xs">Kitchen</span>
        </Button>

        <Button
          variant={isActive("/cart") ? "eco" : "ghost"}
          size="sm"
          onClick={() => navigate("/cart")}
          className="flex flex-col gap-1 h-auto py-2 px-3 relative"
        >
          <div className="relative">
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-warning text-warning-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                {cartItemCount > 9 ? "9+" : cartItemCount}
              </span>
            )}
          </div>
          <span className="text-xs">Cart</span>
        </Button>

        <div className="flex flex-col items-center gap-1 py-2 px-3">
          <Leaf className="h-5 w-5 text-primary" />
          <span className="text-xs text-muted-foreground">EcoGrocer</span>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;