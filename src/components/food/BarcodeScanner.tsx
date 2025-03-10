
import { X, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrowserMultiFormatReader } from '@zxing/library';
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

interface BarcodeScannerProps {
  onCancel: () => void;
  onFoodFound: (food: any) => void;
}

export const BarcodeScanner = ({ onCancel, onFoodFound }: BarcodeScannerProps) => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let codeReader: BrowserMultiFormatReader | null = null;
    let scanInterval: NodeJS.Timeout;
    let isActive = true;

    const initializeScanner = async () => {
      setIsScanning(true);
      setScanProgress(10);
      setError(null);
      
      try {
        codeReader = new BrowserMultiFormatReader();
        const videoInputDevices = await codeReader.listVideoInputDevices();
        
        setScanProgress(20);
        
        if (videoInputDevices.length === 0) {
          setError("No camera found. Please ensure you have a camera connected and have granted permission.");
          toast({
            variant: "destructive",
            title: "No camera found",
            description: "Please ensure you have a camera connected and have granted permission.",
          });
          setIsScanning(false);
          return;
        }
        
        setScanProgress(30);
        
        const previewEl = document.createElement('video');
        previewEl.className = 'w-full h-64 object-cover rounded-lg';
        const previewContainer = document.getElementById('barcode-scanner-preview');
        if (previewContainer) {
          previewContainer.innerHTML = '';
          previewContainer.appendChild(previewEl);
        }
        
        // Start scanning animation
        setScanProgress(40);
        scanInterval = setInterval(() => {
          setScanProgress(prev => {
            // Oscillate between 40 and 90 to show that scanning is ongoing
            if (prev >= 90) return 40;
            return prev + 5;
          });
        }, 500);
        
        try {
          // Configure camera with improved settings for barcode scanning
          const result = await codeReader.decodeOnceFromConstraints(
            { 
              video: { 
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 },
                aspectRatio: { ideal: 1.777778 },
                focusMode: 'continuous'
              } 
            },
            previewEl
          );
          
          if (!isActive) return; // Component unmounted
          
          clearInterval(scanInterval);
          setScanProgress(100);
          
          const barcode = result.getText();
          console.log("Scanned barcode:", barcode);
          
          // Fetch nutritional information from the database
          const { data: nutritionalInfo, error } = await supabase
            .from('nutritional_info')
            .select(`
              *,
              serving_size_options (
                id,
                description,
                grams,
                is_default
              )
            `)
            .eq('barcode', barcode)
            .single();
          
          if (error) {
            console.error("Error fetching nutritional info:", error);
            setError("Failed to fetch nutritional information from the database.");
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to fetch nutritional information.",
            });
            setIsScanning(false);
            return;
          }
          
          if (!nutritionalInfo) {
            setError("This barcode isn't in our database yet.");
            toast({
              variant: "destructive",
              title: "Product not found",
              description: "This barcode isn't in our database yet.",
            });
            setIsScanning(false);
            return;
          }
          
          // Convert nutritional info to Food type
          const food = {
            id: nutritionalInfo.id,
            name: nutritionalInfo.food_item,
            brand: "", // Could be extended to include brand information
            calories: Math.round(nutritionalInfo.kcal),
            protein: Number(nutritionalInfo.protein),
            carbs: Number(nutritionalInfo.carbohydrates),
            fat: Number(nutritionalInfo.fats),
            servingSize: nutritionalInfo.serving_size,
            barcode: nutritionalInfo.barcode,
            supermarket: "All Supermarkets" as const,
            category: "All Categories" as const,
            servingSizeOptions: nutritionalInfo.serving_size_options || []
          };
          
          onFoodFound(food);
          toast({
            title: "Food found!",
            description: `Found ${food.name} in database.`,
          });
          
        } catch (error) {
          if (!isActive) return; // Component unmounted
          
          clearInterval(scanInterval);
          console.error("Scanning error:", error);
          setError("Scanning failed. Please try again or search manually.");
          toast({
            variant: "destructive",
            title: "Scanning failed",
            description: "Please try again or search manually.",
          });
          setIsScanning(false);
        }
      } catch (error) {
        if (!isActive) return; // Component unmounted
        
        clearInterval(scanInterval);
        console.error("Camera initialization error:", error);
        setError("Failed to initialize camera. Please ensure you've granted camera permissions.");
        toast({
          variant: "destructive",
          title: "Camera error",
          description: "Failed to initialize camera. Please check permissions.",
        });
        setIsScanning(false);
      }
    };

    initializeScanner();

    return () => {
      isActive = false;
      clearInterval(scanInterval);
      if (codeReader) {
        codeReader.reset();
      }
    };
  }, [onFoodFound, toast]);

  const handleRetry = () => {
    // Reset state and retry scanning
    window.location.reload();
  };

  return (
    <div className="space-y-4">
      <div 
        id="barcode-scanner-preview" 
        className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden relative"
      >
        {isScanning && (
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <Scan className="h-8 w-8 text-green-500 animate-pulse" />
            <p className="text-sm text-green-600 mt-2">Scanning...</p>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 p-4">
            <div className="text-center">
              <p className="text-red-500 mb-2">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry}
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {isScanning && <Progress value={scanProgress} className="h-1" />}
      
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
