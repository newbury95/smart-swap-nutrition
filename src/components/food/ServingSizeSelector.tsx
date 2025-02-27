
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface ServingSizeOption {
  id: string;
  description: string;
  grams: number;
  is_default: boolean;
}

interface ServingSizeSelectorProps {
  foodId: string;
  onSelect: (servingSize: string, grams: number) => void;
}

export const ServingSizeSelector = ({ foodId, onSelect }: ServingSizeSelectorProps) => {
  const [selectedSize, setSelectedSize] = useState<string>();

  const { data: servingSizes, isLoading } = useQuery({
    queryKey: ['serving-sizes', foodId],
    queryFn: async () => {
      console.log('Fetching serving sizes for food:', foodId);
      const { data, error } = await supabase
        .from('serving_size_options')
        .select('*')
        .eq('nutritional_info_id', foodId)
        .order('is_default', { ascending: false });

      if (error) {
        console.error('Error fetching serving sizes:', error);
        throw error;
      }

      console.log('Serving sizes fetched:', data);
      return data as ServingSizeOption[];
    }
  });

  // Handle default serving size selection when data is loaded
  useEffect(() => {
    if (servingSizes?.length) {
      const defaultSize = servingSizes.find(size => size.is_default);
      if (defaultSize && !selectedSize) {
        console.log('Setting default serving size:', defaultSize);
        setSelectedSize(defaultSize.description);
        onSelect(defaultSize.description, defaultSize.grams);
      }
    }
  }, [servingSizes, selectedSize, onSelect]);

  const handleSizeChange = (value: string) => {
    const selectedOption = servingSizes?.find(size => size.description === value);
    if (selectedOption) {
      console.log('Selected serving size:', selectedOption);
      setSelectedSize(value);
      onSelect(value, selectedOption.grams);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading serving sizes...
      </div>
    );
  }

  if (!servingSizes?.length) {
    return (
      <div className="text-sm text-gray-500">
        No serving sizes available
      </div>
    );
  }

  return (
    <Select value={selectedSize} onValueChange={handleSizeChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select serving size" />
      </SelectTrigger>
      <SelectContent>
        {servingSizes.map((size) => (
          <SelectItem key={size.id} value={size.description}>
            {size.description} ({size.grams}g)
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
