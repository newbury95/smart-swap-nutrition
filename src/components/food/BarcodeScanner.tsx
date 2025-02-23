
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrowserMultiFormatReader } from '@zxing/library';
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface BarcodeScannerProps {
  onCancel: () => void;
  onFoodFound: (food: any) => void;
}

export const BarcodeScanner = ({ onCancel, onFoodFound }: BarcodeScannerProps) => {
  const { toast } = useToast();

  useEffect(() => {
    let codeReader: BrowserMultiFormatReader | null = null;

    const initializeScanner = async () => {
      codeReader = new BrowserMultiFormatReader();
      const videoInputDevices = await codeReader.listVideoInputDevices();
      
      if (videoInputDevices.length === 0) {
        toast({
          variant: "destructive",
          title: "No camera found",
          description: "Please ensure you have a camera connected and have granted permission.",
        });
        return;
      }

      const previewEl = document.createElement('video');
      previewEl.className = 'w-full h-64 object-cover rounded-lg';
      const previewContainer = document.getElementById('barcode-scanner-preview');
      if (previewContainer) {
        previewContainer.innerHTML = '';
        previewContainer.appendChild(previewEl);
      }

      try {
        const result = await codeReader.decodeOnceFromConstraints(
          { video: { facingMode: 'environment' } },
          previewEl
        );

        const barcode = result.getText();
        console.log("Scanned barcode:", barcode);

        const { data: nutritionalInfo, error } = await supabase
          .from('nutritional_info')
          .select('*')
          .eq('barcode', barcode)
          .single();

        if (error) {
          console.error("Error fetching nutritional info:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch nutritional information.",
          });
          return;
        }

        if (!nutritionalInfo) {
          toast({
            variant: "destructive",
            title: "Product not found",
            description: "This barcode isn't in our database yet.",
          });
          return;
        }

        // Convert nutritional info to Food type
        const food = {
          id: nutritionalInfo.id,
          name: nutritionalInfo.food_item,
          brand: "",
          calories: nutritionalInfo.kcal,
          protein: nutritionalInfo.protein,
          carbs: nutritionalInfo.carbohydrates,
          fat: nutritionalInfo.fats,
          servingSize: nutritionalInfo.serving_size,
          barcode: nutritionalInfo.barcode,
          supermarket: "All Supermarkets" as const,
          category: "All Categories" as const,
        };

        onFoodFound(food);
        toast({
          title: "Food found!",
          description: `Found ${food.name} in database.`,
        });

      } catch (error) {
        console.error("Scanning error:", error);
        toast({
          variant: "destructive",
          title: "Scanning failed",
          description: "Please try again or search manually.",
        });
      }
    };

    initializeScanner();

    return () => {
      if (codeReader) {
        codeReader.reset();
      }
    };
  }, [onFoodFound, toast]);

  return (
    <div className="space-y-4">
      <div id="barcode-scanner-preview" className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden" />
      <p className="text-center text-sm text-muted-foreground">
        Point your camera at a barcode
      </p>
      <Button
        variant="outline"
        className="w-full"
        onClick={onCancel}
      >
        <X className="h-4 w-4 mr-2" />
        Cancel Scanning
      </Button>
    </div>
  );
};
