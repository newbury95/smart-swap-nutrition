
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { Label } from "@/components/ui/label";

interface CustomFoodFormProps {
  onSuccess: () => void;
}

export const CustomFoodForm = ({ onSuccess }: CustomFoodFormProps) => {
  const { toast } = useToast();
  const { addCustomFood } = useSupabase();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    serving_size_amount: "",
    serving_size_unit: "g",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const servingSize = `${formData.serving_size_amount}${formData.serving_size_unit}`;
      
      await addCustomFood({
        name: formData.name,
        brand: formData.brand || undefined,
        calories: parseInt(formData.calories) || 0,
        protein: parseFloat(formData.protein) || 0,
        carbs: parseFloat(formData.carbs) || 0,
        fat: parseFloat(formData.fat) || 0,
        serving_size: servingSize,
      });

      toast({
        title: "Success",
        description: "Custom food added successfully",
      });
      
      onSuccess();
      setFormData({
        name: "",
        brand: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        serving_size_amount: "",
        serving_size_unit: "g",
      });
    } catch (error) {
      console.error("Error adding custom food:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add custom food: " + (error.message || "Unknown error"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Food Name*</Label>
        <Input
          id="name"
          placeholder="Food name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="brand">Brand</Label>
        <Input
          id="brand"
          placeholder="Brand (optional)"
          value={formData.brand}
          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="calories">Calories*</Label>
        <Input
          id="calories"
          type="number"
          placeholder="Calories"
          value={formData.calories}
          onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="protein">Protein (g)*</Label>
          <Input
            id="protein"
            type="number"
            step="0.1"
            placeholder="Protein (g)"
            value={formData.protein}
            onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="carbs">Carbs (g)*</Label>
          <Input
            id="carbs"
            type="number"
            step="0.1"
            placeholder="Carbs (g)"
            value={formData.carbs}
            onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="fat">Fat (g)*</Label>
        <Input
          id="fat"
          type="number" 
          step="0.1"
          placeholder="Fat (g)"
          value={formData.fat}
          onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="serving_size_amount">Serving Size*</Label>
          <Input
            id="serving_size_amount"
            type="number"
            step="0.1"
            placeholder="Amount"
            value={formData.serving_size_amount}
            onChange={(e) => setFormData({ ...formData, serving_size_amount: e.target.value })}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="serving_size_unit">Unit*</Label>
          <Input
            id="serving_size_unit"
            placeholder="g, ml, piece, etc."
            value={formData.serving_size_unit}
            onChange={(e) => setFormData({ ...formData, serving_size_unit: e.target.value })}
            required
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Adding..." : "Add Custom Food"}
      </Button>
    </form>
  );
};
