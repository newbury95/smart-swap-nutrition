
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  threadId: string | null;
}

export const ReportDialog = ({ 
  open, 
  onOpenChange, 
  threadId 
}: ReportDialogProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [reportReason, setReportReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReport = async () => {
    if (!user || !threadId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Authentication or thread information missing."
      });
      return;
    }
    
    if (!reportReason.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide a reason for your report."
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('forum_reports')
        .insert({
          thread_id: threadId,
          user_id: user.id,
          reason: reportReason
        });
      
      if (error) throw error;
      
      // Send email to contact@nutritrack.co.uk with the report details
      // In a real implementation, you would use a serverless function to send emails
      console.log(`Sending report email to contact@nutritrack.co.uk:
        Thread ID: ${threadId}
        Reason: ${reportReason}
        Reporter: ${user.email}
      `);
      
      toast({
        title: "Report submitted",
        description: "Thank you for helping keep our community safe."
      });
      
      setReportReason("");
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit report. Please try again."
      });
    } finally {
      setIsSubmitting(false);
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
            <label htmlFor="report-reason" className="text-sm font-medium">
              Reason for reporting
            </label>
            <Textarea
              id="report-reason"
              placeholder="Please explain why you're reporting this thread..."
              rows={4}
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
          </div>
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
            onClick={submitReport}
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
