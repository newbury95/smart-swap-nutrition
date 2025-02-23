
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PremiumFoodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PremiumFoodDialog = ({ open, onOpenChange }: PremiumFoodDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade to Premium</DialogTitle>
          <DialogDescription>
            Get access to custom food creation and more premium features by upgrading your account.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Maybe Later
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Upgrade Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
