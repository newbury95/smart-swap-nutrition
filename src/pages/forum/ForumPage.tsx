
import { useState } from "react";
import { Plus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ThreadList } from "@/components/forum/ThreadList";
import { NewThreadDialog } from "@/components/forum/NewThreadDialog";
import { ReportDialog } from "@/components/forum/ReportDialog";
import type { ForumThread } from "@/hooks/types/supabase";

const ForumPage = () => {
  const { user } = useAuth();
  const [showNewThreadDialog, setShowNewThreadDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportedThreadId, setReportedThreadId] = useState<string | null>(null);
  const [threads, setThreads] = useState<ForumThread[]>([]);

  const handleReportThread = (threadId: string) => {
    setReportedThreadId(threadId);
    setShowReportDialog(true);
  };

  const handleThreadCreated = (newThread: ForumThread) => {
    setThreads(prev => [newThread, ...prev]);
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
            
            <ThreadList onReportThread={handleReportThread} />
          </div>
        </div>
      </main>

      <NewThreadDialog 
        open={showNewThreadDialog} 
        onOpenChange={setShowNewThreadDialog} 
        onThreadCreated={handleThreadCreated} 
      />

      <ReportDialog 
        open={showReportDialog} 
        onOpenChange={setShowReportDialog}
        threadId={reportedThreadId}
      />
    </div>
  );
};

export default ForumPage;
