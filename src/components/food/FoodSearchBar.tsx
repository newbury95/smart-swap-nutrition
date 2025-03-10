
import { Search, Barcode, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FoodSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onBarcodeClick: () => void;
  onClear?: () => void;  // Making this optional to maintain backward compatibility
  isScanning: boolean;
}

export const FoodSearchBar = ({
  searchQuery,
  onSearchChange,
  onBarcodeClick,
  onClear,
  isScanning
}: FoodSearchBarProps) => {
  return (
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <Input
          placeholder="Search foods..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pr-8"
        />
        {searchQuery && onClear && (
          <button 
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={onClear}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={onBarcodeClick}
        disabled={isScanning}
      >
        <Barcode className="h-4 w-4" />
      </Button>
    </div>
  );
};
