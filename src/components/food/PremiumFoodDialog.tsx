
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface PremiumFoodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PremiumFoodDialog = ({ open, onOpenChange }: PremiumFoodDialogProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleUpgrade = () => {
    onOpenChange(false);
    
    if (user) {
      // Direct existing users to Stripe payment link
      window.open("https://buy.stripe.com/3cs7vfbo97269pudQQ", "_blank");
    } else {
      navigate('/auth?tab=signup&redirect=premium');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            Premium Feature
          </DialogTitle>
          <DialogDescription>
            Custom foods are only available to premium users. Upgrade your account to unlock this feature.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Button 
            onClick={handleUpgrade}
            className="w-full"
          >
            {user ? "Complete Payment" : "Upgrade to Premium"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
