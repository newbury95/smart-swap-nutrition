
import { useState } from "react";
import { Crown, Flag, Plus, MessageSquare, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const ForumPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [showNewThreadDialog, setShowNewThreadDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportedThreadId, setReportedThreadId] = useState<string | null>(null);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [threads, setThreads] = useState([]);

  const handleCreateThread = () => {
    if (!newThreadTitle.trim() || !newThreadContent.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Thread title and content are required."
      });
      return;
    }

    // In a real implementation, you would save to Supabase here
    toast({
      title: "Thread created",
      description: "Your thread has been posted successfully."
    });
    
    setNewThreadTitle("");
    setNewThreadContent("");
    setShowNewThreadDialog(false);
  };

  const handleReportThread = (threadId: string) => {
    setReportedThreadId(threadId);
    setShowReportDialog(true);
  };

  const submitReport = () => {
    if (!reportReason.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide a reason for your report."
      });
      return;
    }

    // In a real implementation, you would save the report to Supabase here
    toast({
      title: "Report submitted",
      description: "Thank you for helping keep our community safe."
    });
    
    setReportReason("");
    setReportedThreadId(null);
    setShowReportDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Community Forum</h1>
              <Button 
                onClick={() => setShowNewThreadDialog(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Start Thread
              </Button>
            </div>
            
            <p className="text-gray-600 mb-8">
              Connect with other members, share your journey, and get support from the community.
            </p>
            
            {threads.length > 0 ? (
              <div className="space-y-4">
                {threads.map((thread: any) => (
                  <div key={thread.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-lg mb-1">{thread.title}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>By {thread.author} • {thread.createdAt}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-gray-500 text-sm mr-4">
                          <MessageSquare className="inline w-4 h-4 mr-1" />
                          {thread.replies}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReportThread(thread.id)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <Flag className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No threads yet. Be the first to start a conversation!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* New Thread Dialog */}
      <Dialog open={showNewThreadDialog} onOpenChange={setShowNewThreadDialog}>
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
              onClick={() => setShowNewThreadDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateThread}
              className="bg-green-600 hover:bg-green-700"
            >
              Post Thread
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
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
              onClick={() => setShowReportDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={submitReport}
              variant="destructive"
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ForumPage;
