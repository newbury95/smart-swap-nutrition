
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BarcodeScannerProps {
  onCancel: () => void;
}

export const BarcodeScanner = ({ onCancel }: BarcodeScannerProps) => {
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
