
import { Search, Barcode, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";

interface FoodSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFilterClick: () => void;
  onBarcodeClick: () => void;
  isScanning: boolean;
  onSearch: (query: string) => void;
}

export const FoodSearchBar = ({
  searchQuery,
  onSearchChange,
  onFilterClick,
  onBarcodeClick,
  isScanning,
  onSearch
}: FoodSearchBarProps) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const debouncedQuery = useDebounce(localQuery, 300);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleChange = (value: string) => {
    setLocalQuery(value);
    onSearchChange(value);
  };

  return (
    <div className="flex gap-2">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search foods..."
          value={localQuery}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full pl-10"
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
