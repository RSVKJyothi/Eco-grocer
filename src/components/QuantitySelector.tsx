import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
}

const QuantitySelector = ({ quantity, onIncrease, onDecrease, min = 0 }: QuantitySelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onDecrease}
        disabled={quantity <= min}
        className="h-8 w-8 p-0 rounded-full border-primary/20 hover:border-primary hover:bg-primary/5"
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="min-w-[2rem] text-center font-semibold text-foreground">
        {quantity}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onIncrease}
        className="h-8 w-8 p-0 rounded-full border-primary/20 hover:border-primary hover:bg-primary/5"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default QuantitySelector;