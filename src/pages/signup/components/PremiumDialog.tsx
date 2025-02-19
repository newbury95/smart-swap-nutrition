
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PremiumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade: () => void;
}

const premiumFeatures = [
  "Personalized meal plans",
  "Advanced nutrition tracking",
  "Expert consultation access",
  "Premium recipes library",
  "Progress analytics",
];

export const PremiumDialog = ({ open, onOpenChange, onUpgrade }: PremiumDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Unlock Premium Benefits</DialogTitle>
          <DialogDescription>
            Upgrade to our premium plan for just £7.99/month and get access to:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {premiumFeatures.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="sm:w-full"
          >
            Continue with Free Plan
          </Button>
          <Button
            onClick={onUpgrade}
            className="sm:w-full bg-green-600 hover:bg-green-700"
          >
            Upgrade to Premium
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
