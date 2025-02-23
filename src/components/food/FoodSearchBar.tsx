
import { Search, Barcode, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FoodSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFilterClick: () => void;
  onBarcodeClick: () => void;
  isScanning: boolean;
}

export const FoodSearchBar = ({
  searchQuery,
  onSearchChange,
  onFilterClick,
  onBarcodeClick,
  isScanning
}: FoodSearchBarProps) => {
  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <Input
          placeholder="Search foods..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={onFilterClick}
      >
        <Filter className="h-4 w-4" />
      </Button>
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
