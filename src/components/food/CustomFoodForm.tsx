
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useSupabase } from "@/hooks/useSupabase";

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
    serving_size_unit: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const servingSize = `${formData.serving_size_amount}${formData.serving_size_unit}`;
      
      await addCustomFood({
        name: formData.name,
        brand: formData.brand,
        calories: parseInt(formData.calories),
        protein: parseFloat(formData.protein),
        carbs: parseFloat(formData.carbs),
        fat: parseFloat(formData.fat),
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
        serving_size_unit: "",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add custom food",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Food name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <Input
        placeholder="Brand (optional)"
        value={formData.brand}
        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
      />
      <Input
        type="number"
        placeholder="Calories"
        value={formData.calories}
        onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
        required
      />
      <div className="grid grid-cols-3 gap-2">
        <Input
          type="number"
          step="0.1"
          placeholder="Protein (g)"
          value={formData.protein}
          onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
          required
        />
        <Input
          type="number"
          step="0.1"
          placeholder="Carbs (g)"
          value={formData.carbs}
          onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
          required
        />
        <Input
          type="number"
          step="0.1"
          placeholder="Fat (g)"
          value={formData.fat}
          onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="number"
          step="0.1"
          placeholder="Serving size amount"
          value={formData.serving_size_amount}
          onChange={(e) => setFormData({ ...formData, serving_size_amount: e.target.value })}
          required
        />
        <Input
          placeholder="Unit (e.g., g, slice, piece)"
          value={formData.serving_size_unit}
          onChange={(e) => setFormData({ ...formData, serving_size_unit: e.target.value })}
          required
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Custom Food"}
      </Button>
    </form>
  );
};

