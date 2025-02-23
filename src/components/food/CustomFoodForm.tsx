
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const CustomFoodForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    serving_size: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('nutritional_info')
        .insert([
          {
            food_item: formData.name,
            kcal: parseInt(formData.calories),
            protein: parseFloat(formData.protein),
            carbohydrates: parseFloat(formData.carbs),
            fats: parseFloat(formData.fat),
            serving_size: formData.serving_size,
            provider: 'Generic',
            sugar: 0,
            saturates: 0,
            salt: 0,
            calcium: 0
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Custom food added successfully",
      });
      
      onSuccess();
      setFormData({
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        serving_size: "",
      });
    } catch (error) {
      console.error('Error adding custom food:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add custom food. Please try again.",
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
      <Input
        placeholder="Serving size (e.g., 100g, 1 piece)"
        value={formData.serving_size}
        onChange={(e) => setFormData({ ...formData, serving_size: e.target.value })}
        required
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Adding..." : "Add Custom Food"}
      </Button>
    </form>
  );
};
