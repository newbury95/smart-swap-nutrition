
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { CustomFoodForm } from "@/components/food/CustomFoodForm";
import { useToast } from "@/components/ui/use-toast";

const CustomFoodsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSuccess = () => {
    toast({
      title: "Success",
      description: "Custom food added successfully",
    });
    navigate("/diary");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="max-w-2xl mx-auto bg-white rounded-xl p-8 shadow-sm">
          <h1 className="text-2xl font-semibold mb-6">Add Custom Food</h1>
          <CustomFoodForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
};

export default CustomFoodsPage;
