
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";

interface ThreadDetailReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (reason: string, email: string) => Promise<void>;
  isSubmitting: boolean;
}

export const ThreadDetailReportDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit,
  isSubmitting 
}: ThreadDetailReportDialogProps) => {
  const { user } = useAuth();
  const [reportReason, setReportReason] = useState("");
  const [reportEmail, setReportEmail] = useState("");

  const handleSubmit = async () => {
    if (reportReason.trim()) {
      await onSubmit(reportReason, reportEmail);
      setReportReason("");
      setReportEmail("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report Thread</DialogTitle>
          <DialogDescription>
            Help us keep the community safe by reporting inappropriate content.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="report-reason">Reason for reporting</Label>
            <Textarea
              id="report-reason"
              placeholder="Please explain why you're reporting this thread..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              rows={4}
            />
          </div>
          
          {!user && (
            <div className="space-y-2">
              <Label htmlFor="report-email">Your email (optional)</Label>
              <Input
                id="report-email"
                type="email"
                placeholder="Enter your email address"
                value={reportEmail}
                onChange={(e) => setReportEmail(e.target.value)}
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="destructive"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
