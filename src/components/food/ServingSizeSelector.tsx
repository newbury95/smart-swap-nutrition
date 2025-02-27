
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ServingSizeOption {
  id: string;
  description: string;
  grams: number;
  is_default: boolean;
}

interface ServingSizeSelectorProps {
  foodId: string;
  foodName?: string;
  onSelect: (servingSize: string, grams: number) => void;
}

export const ServingSizeSelector = ({ foodId, foodName, onSelect }: ServingSizeSelectorProps) => {
  const [selectedSize, setSelectedSize] = useState<string>();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [newGrams, setNewGrams] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

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

  const addServingSizeMutation = useMutation({
    mutationFn: async (newServingSize: Omit<ServingSizeOption, 'id'>) => {
      const { data, error } = await supabase
        .from('serving_size_options')
        .insert([{
          nutritional_info_id: foodId,
          description: newServingSize.description,
          grams: newServingSize.grams,
          is_default: newServingSize.is_default
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch the serving sizes query
      queryClient.invalidateQueries({ queryKey: ['serving-sizes', foodId] });
      toast({
        title: "Success",
        description: "Serving size option added",
      });
      setShowAddDialog(false);
      resetForm();
    },
    onError: (error) => {
      console.error('Error adding serving size:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add serving size option",
      });
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

  const handleAddServingSize = () => {
    if (!newDescription || !newGrams) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    const gramsValue = parseFloat(newGrams);
    if (isNaN(gramsValue) || gramsValue <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid weight in grams",
      });
      return;
    }

    addServingSizeMutation.mutate({
      description: newDescription,
      grams: gramsValue,
      is_default: isDefault && (!servingSizes || servingSizes.length === 0)
    });
  };

  const resetForm = () => {
    setNewDescription("");
    setNewGrams("");
    setIsDefault(false);
  };

  // Common serving size suggestions based on food name
  const getServingSuggestions = () => {
    const suggestions = [];
    
    // Convert food name to lowercase for easier pattern matching
    const lowercaseName = foodName?.toLowerCase() || '';
    
    // For breads
    if (lowercaseName.includes('bread') || lowercaseName.includes('loaf')) {
      suggestions.push({ description: '1 loaf', grams: getEstimatedWeight('loaf') });
      suggestions.push({ description: '1 slice', grams: getEstimatedWeight('bread-slice') });
    }
    
    // For packaged items
    if (!lowercaseName.includes('loose') && !lowercaseName.includes('kg')) {
      suggestions.push({ description: '1 pack', grams: getEstimatedWeight('pack') });
    }
    
    // For fruits and vegetables
    if (isFruitOrVegetable(lowercaseName)) {
      suggestions.push({ description: '1 piece', grams: getEstimatedWeight(lowercaseName) });
    }
    
    // For meats and fish
    if (isMeatOrFish(lowercaseName)) {
      suggestions.push({ description: '1 serving', grams: 100 });
      suggestions.push({ description: '1 fillet', grams: getEstimatedWeight('fillet') });
    }

    return suggestions;
  };

  // Helper function to determine if a food is a fruit or vegetable
  const isFruitOrVegetable = (name: string) => {
    const fruitsAndVegetables = [
      'apple', 'banana', 'orange', 'pear', 'grape', 'kiwi', 'strawberry', 'blueberry',
      'carrot', 'potato', 'onion', 'tomato', 'cucumber', 'lettuce', 'spinach', 'pepper',
      'broccoli', 'cauliflower', 'cabbage', 'kale', 'avocado'
    ];
    return fruitsAndVegetables.some(item => name.includes(item));
  };

  // Helper function to determine if a food is meat or fish
  const isMeatOrFish = (name: string) => {
    const meatsAndFish = [
      'beef', 'chicken', 'pork', 'lamb', 'turkey', 'duck', 'venison',
      'salmon', 'tuna', 'cod', 'haddock', 'trout', 'prawn', 'shrimp', 'fish'
    ];
    return meatsAndFish.some(item => name.includes(item));
  };

  // Helper function to estimate weight based on food type
  const getEstimatedWeight = (type: string) => {
    // These are estimated average weights for different food types
    const weights: Record<string, number> = {
      'loaf': 800, // 800g for a standard loaf
      'bread-slice': 40, // 40g for a typical bread slice
      'pack': 250, // 250g for a default pack size
      'fillet': 150, // 150g for a typical fillet
      'apple': 182,
      'banana': 118,
      'orange': 131,
      'potato': 213,
      'carrot': 72,
      'tomato': 123,
      // Add more specific weights as needed
    };
    
    return weights[type] || 100; // Default to 100g if not found
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading serving sizes...
      </div>
    );
  }

  const suggestions = getServingSuggestions();

  return (
    <div className="space-y-3">
      <Select value={selectedSize} onValueChange={handleSizeChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select serving size" />
        </SelectTrigger>
        <SelectContent>
          {servingSizes?.map((size) => (
            <SelectItem key={size.id} value={size.description}>
              {size.description} ({size.grams}g)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Serving Size
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Serving Size</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="e.g., 1 slice, 100g, 1 cup"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Weight (grams)</label>
              <Input
                type="number"
                placeholder="e.g., 30"
                value={newGrams}
                onChange={(e) => setNewGrams(e.target.value)}
              />
            </div>
            {(!servingSizes || servingSizes.length === 0) && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is-default"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="is-default" className="text-sm font-medium">
                  Set as default serving size
                </label>
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Suggestions</label>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNewDescription(suggestion.description);
                        setNewGrams(suggestion.grams.toString());
                      }}
                    >
                      {suggestion.description} ({suggestion.grams}g)
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddServingSize}
              disabled={addServingSizeMutation.isPending}
            >
              {addServingSizeMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {(!servingSizes || servingSizes.length === 0) && (
        <div className="text-sm text-amber-600 flex items-center gap-1">
          No serving sizes available. Please add one.
        </div>
      )}
    </div>
  );
};
