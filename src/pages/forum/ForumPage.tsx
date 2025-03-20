import { useState, useEffect } from "react";
import { Crown, Flag, Plus, MessageSquare, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import type { ForumThread, ForumReport } from "@/hooks/types/supabase";

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
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setIsLoading(true);
        const { data: threadsData, error } = await supabase
          .from('forum_threads')
          .select(`
            id,
            title,
            content,
            user_id,
            created_at
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const threadsWithReplies = await Promise.all(threadsData?.map(async (thread) => {
          const { count, error: countError } = await supabase
            .from('forum_replies')
            .select('*', { count: 'exact', head: true })
            .eq('thread_id', thread.id);
          
          if (countError) {
            console.error('Error counting replies:', countError);
            return {
              ...thread,
              author: 'Anonymous',
              replies: 0
            };
          }
          
          let authorName = 'Anonymous';
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('first_name, last_name')
              .eq('id', thread.user_id)
              .single();
            
            if (!profileError && profileData) {
              authorName = `${profileData.first_name} ${profileData.last_name}`;
            }
          } catch (err) {
            console.error('Error fetching profile data:', err);
          }
          
          return {
            ...thread,
            author: authorName,
            replies: count || 0
          };
        }) || []);
        
        const formattedThreads = threadsWithReplies.map(thread => ({
          id: thread.id,
          title: thread.title,
          content: thread.content,
          user_id: thread.user_id,
          created_at: format(new Date(thread.created_at), 'PP'),
          author: thread.author,
          replies: thread.replies
        }));
        
        setThreads(formattedThreads);
      } catch (error) {
        console.error('Error fetching threads:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load forum threads."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchThreads();
  }, [toast]);

  const handleCreateThread = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to create a thread."
      });
      navigate("/auth");
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
        
        setThreads(prev => [newThread, ...prev]);
      }
      
      toast({
        title: "Thread created",
        description: "Your thread has been posted successfully."
      });
      
      setNewThreadTitle("");
      setNewThreadContent("");
      setShowNewThreadDialog(false);
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

  const handleReportThread = (threadId: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to report a thread."
      });
      navigate("/auth");
      return;
    }
    
    setReportedThreadId(threadId);
    setShowReportDialog(true);
  };

  const submitReport = async () => {
    if (!user || !reportedThreadId) {
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
          thread_id: reportedThreadId,
          user_id: user.id,
          reason: reportReason
        });
      
      if (error) throw error;
      
      toast({
        title: "Report submitted",
        description: "Thank you for helping keep our community safe."
      });
      
      setReportReason("");
      setReportedThreadId(null);
      setShowReportDialog(false);
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

  const viewThread = (threadId: string) => {
    navigate(`/forum/thread/${threadId}`);
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
            
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30 animate-pulse" />
                <p>Loading threads...</p>
              </div>
            ) : threads.length > 0 ? (
              <div className="space-y-4">
                {threads.map((thread) => (
                  <div 
                    key={thread.id} 
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => viewThread(thread.id)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-lg mb-1">{thread.title}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>By {thread.author} • {thread.created_at}</span>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReportThread(thread.id);
                          }}
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
    </div>
  );
};

export default ForumPage;
