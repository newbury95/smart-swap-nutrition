
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

interface PremiumFoodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PremiumFoodDialog = ({ open, onOpenChange }: PremiumFoodDialogProps) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onOpenChange(false);
    navigate('/premium-upgrade');
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
            Upgrade to Premium
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

