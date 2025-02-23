
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

export const AddCustomFood = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    food_item: "",
    kcal: "",
    protein: "",
    carbohydrates: "",
    fats: "",
    serving_size: "",
    provider: "Generic" as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('nutritional_info')
        .insert([{
          food_item: formData.food_item,
          kcal: parseFloat(formData.kcal),
          protein: parseFloat(formData.protein),
          carbohydrates: parseFloat(formData.carbohydrates),
          fats: parseFloat(formData.fats),
          serving_size: formData.serving_size,
          provider: formData.provider,
          sugar: 0,
          salt: 0,
          saturates: 0,
          calcium: 0
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Custom food added successfully",
      });
      
      navigate(-1);
    } catch (error) {
      console.error('Error adding custom food:', error);
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-3xl font-bold mb-6">Add Custom Food</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
            <Input
              placeholder="Food name"
              value={formData.food_item}
              onChange={(e) => setFormData({ ...formData, food_item: e.target.value })}
              required
            />
            <Input
              type="number"
              step="0.1"
              placeholder="Calories (kcal)"
              value={formData.kcal}
              onChange={(e) => setFormData({ ...formData, kcal: e.target.value })}
              required
            />
            <div className="grid grid-cols-3 gap-4">
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
                value={formData.carbohydrates}
                onChange={(e) => setFormData({ ...formData, carbohydrates: e.target.value })}
                required
              />
              <Input
                type="number"
                step="0.1"
                placeholder="Fat (g)"
                value={formData.fats}
                onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
                required
              />
            </div>
            <Input
              placeholder="Serving size (e.g., 100g, 1 piece)"
              value={formData.serving_size}
              onChange={(e) => setFormData({ ...formData, serving_size: e.target.value })}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Adding..." : "Add Custom Food"}
            </Button>
          </form>
        </motion.div>
      </main>

      {/* Criteo Ad Banners */}
      <div id="criteo-top" className="w-full h-[90px] bg-gray-100 mb-4">
        {/* Criteo Top Banner */}
      </div>
      
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 w-[160px] h-[600px] bg-gray-100">
        {/* Criteo Side Banner */}
      </div>
      
      <div id="criteo-bottom" className="w-full h-[90px] bg-gray-100 mt-8">
        {/* Criteo Bottom Banner */}
      </div>
    </div>
  );
};

export default AddCustomFood;
