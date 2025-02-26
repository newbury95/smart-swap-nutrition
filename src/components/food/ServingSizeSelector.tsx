
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ServingSizeOption {
  id: string;
  description: string;
  grams: number;
  is_default: boolean;
}

interface ServingSizeSelectorProps {
  foodId: string;
  onSelect: (servingSize: string) => void;
}

export const ServingSizeSelector = ({ foodId, onSelect }: ServingSizeSelectorProps) => {
  const [selectedSize, setSelectedSize] = useState<string>();

  const { data: servingSizes } = useQuery({
    queryKey: ['serving-sizes', foodId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('serving_size_options')
        .select('*')
        .eq('nutritional_info_id', foodId);

      if (error) throw error;
      return data as ServingSizeOption[];
    },
    onSuccess: (data) => {
      const defaultSize = data.find(size => size.is_default);
      if (defaultSize && !selectedSize) {
        setSelectedSize(defaultSize.description);
        onSelect(defaultSize.description);
      }
    }
  });

  const handleSizeChange = (value: string) => {
    setSelectedSize(value);
    onSelect(value);
  };

  if (!servingSizes?.length) {
    return null;
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

