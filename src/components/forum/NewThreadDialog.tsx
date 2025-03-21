
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import type { ForumThread } from "@/hooks/types/supabase";

interface NewThreadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onThreadCreated: (thread: ForumThread) => void;
}

export const NewThreadDialog = ({ 
  open, 
  onOpenChange, 
  onThreadCreated 
}: NewThreadDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateThread = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to create a thread."
      });
      return;
    }
    
    if (!newThreadTitle.trim() || !newThreadContent.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Thread title and content are required."
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('forum_threads')
        .insert([{
          title: newThreadTitle,
          content: newThreadContent,
          user_id: user.id
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error details:', error);
        throw error;
      }
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.warn('Could not fetch profile data:', profileError);
      }
      
      if (data) {
        const authorName = profileData 
          ? `${profileData.first_name} ${profileData.last_name}` 
          : user.email?.split('@')[0] || 'Anonymous';
          
        const newThread = {
          id: data.id,
          title: data.title,
          content: data.content,
          user_id: data.user_id,
          created_at: format(new Date(), 'PP'),
          author: authorName,
          replies: 0
        };
        
        onThreadCreated(newThread);
      }
      
      toast({
        title: "Thread created",
        description: "Your thread has been posted successfully."
      });
      
      setNewThreadTitle("");
      setNewThreadContent("");
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating thread:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create thread. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a New Thread</DialogTitle>
          <DialogDescription>
            Share your thoughts, questions, or insights with the community.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="thread-title" className="text-sm font-medium">
              Thread Title
            </label>
            <Input
              id="thread-title"
              placeholder="What's your thread about?"
              value={newThreadTitle}
              onChange={(e) => setNewThreadTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="thread-content" className="text-sm font-medium">
              Content
            </label>
            <Textarea
              id="thread-content"
              placeholder="Share more details..."
              rows={5}
              value={newThreadContent}
              onChange={(e) => setNewThreadContent(e.target.value)}
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
            onClick={handleCreateThread}
            className="bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post Thread"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
