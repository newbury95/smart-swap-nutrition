
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MessageSquare, Heart, Flag, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ThreadType {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  author: string;
  likes: number;
  liked_by_user: boolean;
}

interface ReplyType {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  author: string;
}

const ThreadDetailPage = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [thread, setThread] = useState<ThreadType | null>(null);
  const [replies, setReplies] = useState<ReplyType[]>([]);
  const [newReply, setNewReply] = useState("");
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportEmail, setReportEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch thread details
  useEffect(() => {
    const fetchThreadDetails = async () => {
      if (!threadId) return;

      try {
        setIsLoading(true);
        
        // Fetch thread data
        const { data: threadData, error: threadError } = await supabase
          .from('forum_threads')
          .select(`
            id,
            title,
            content,
            user_id,
            created_at
          `)
          .eq('id', threadId)
          .single();
        
        if (threadError) throw threadError;
        
        // Fetch thread author
        const { data: authorData, error: authorError } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', threadData.user_id)
          .single();
        
        // Fetch thread likes count
        const { count: likesCount, error: likesCountError } = await supabase
          .from('forum_likes')
          .select('*', { count: 'exact', head: true })
          .eq('thread_id', threadId);
        
        // Check if user has liked this thread
        let likedByUser = false;
        if (user) {
          const { data: likeData, error: likeError } = await supabase
            .from('forum_likes')
            .select('id')
            .eq('thread_id', threadId)
            .eq('user_id', user.id)
            .maybeSingle();
          
          likedByUser = !!likeData;
        }

        const authorName = authorData 
          ? `${authorData.first_name} ${authorData.last_name}`
          : 'Anonymous';
        
        setThread({
          ...threadData,
          author: authorName,
          likes: likesCount || 0,
          liked_by_user: likedByUser
        });
        
        // Fetch replies
        const { data: repliesData, error: repliesError } = await supabase
          .from('forum_replies')
          .select(`
            id,
            content, 
            user_id,
            created_at
          `)
          .eq('thread_id', threadId)
          .order('created_at', { ascending: true });
        
        if (repliesError) throw repliesError;
        
        // Get author information for each reply
        const repliesWithAuthors = await Promise.all(repliesData.map(async (reply) => {
          const { data: replyAuthorData } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', reply.user_id)
            .maybeSingle();
          
          const replyAuthorName = replyAuthorData 
            ? `${replyAuthorData.first_name} ${replyAuthorData.last_name}`
            : 'Anonymous';
          
          return {
            ...reply,
            author: replyAuthorName,
            created_at: format(new Date(reply.created_at), 'PP')
          };
        }));
        
        setReplies(repliesWithAuthors);
      } catch (error) {
        console.error('Error fetching thread details:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load thread details."
        });
        navigate("/forum");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchThreadDetails();
  }, [threadId, navigate, toast, user]);

  const handleAddReply = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to reply to a thread."
      });
      navigate("/auth");
      return;
    }
    
    if (!newReply.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Reply content cannot be empty."
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('forum_replies')
        .insert([{
          thread_id: threadId,
          content: newReply,
          user_id: user.id
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Get user profile info
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();
      
      const authorName = profileData 
        ? `${profileData.first_name} ${profileData.last_name}`
        : user.email?.split('@')[0] || 'Anonymous';
      
      // Add the new reply to the state
      const newReplyObj = {
        id: data.id,
        content: data.content,
        user_id: data.user_id,
        created_at: format(new Date(), 'PP'),
        author: authorName
      };
      
      setReplies(prev => [...prev, newReplyObj]);
      setNewReply("");
      
      toast({
        title: "Reply added",
        description: "Your reply has been posted successfully."
      });
    } catch (error) {
      console.error('Error adding reply:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to post reply. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeThread = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to like a thread."
      });
      navigate("/auth");
      return;
    }

    try {
      if (thread?.liked_by_user) {
        // Unlike the thread
        const { error } = await supabase
          .from('forum_likes')
          .delete()
          .eq('thread_id', threadId)
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        setThread(prev => prev ? {
          ...prev,
          likes: prev.likes - 1,
          liked_by_user: false
        } : null);
        
        toast({
          title: "Unliked",
          description: "You have unliked this thread."
        });
      } else {
        // Like the thread
        const { error } = await supabase
          .from('forum_likes')
          .insert([{
            thread_id: threadId,
            user_id: user.id
          }]);
        
        if (error) throw error;
        
        setThread(prev => prev ? {
          ...prev,
          likes: prev.likes + 1,
          liked_by_user: true
        } : null);
        
        toast({
          title: "Liked",
          description: "You have liked this thread."
        });
      }
    } catch (error) {
      console.error('Error liking/unliking thread:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update like status. Please try again."
      });
    }
  };

  const handleReportThread = async () => {
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
      
      // Store the report in the database
      if (user) {
        const { error } = await supabase
          .from('forum_reports')
          .insert([{
            thread_id: threadId,
            user_id: user.id,
            reason: reportReason
          }]);
        
        if (error) throw error;
      }
      
      // Send email to contact@nutritrack.co.uk with the report details
      // In a real implementation, you would use a serverless function to send emails
      // For this example, we'll just log it and show a success message
      console.log(`Sending report email to contact@nutritrack.co.uk:
        Thread ID: ${threadId}
        Reason: ${reportReason}
        Reporter: ${reportEmail || (user ? user.email : 'Anonymous')}
      `);
      
      setReportReason("");
      setReportEmail("");
      setShowReportDialog(false);
      
      toast({
        title: "Report submitted",
        description: "Thank you for helping keep our community safe."
      });
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
    <div className="min-h-screen bg-gray-50 pb-32">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/forum")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Forum
          </Button>
          
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30 animate-pulse" />
              <p>Loading thread...</p>
            </div>
          ) : thread ? (
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-semibold">{thread.title}</h1>
                      <p className="text-gray-500 text-sm mt-1">
                        Posted by {thread.author} on {format(new Date(thread.created_at), 'PP')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={thread.liked_by_user ? "default" : "outline"}
                        size="sm"
                        onClick={handleLikeThread}
                        className={thread.liked_by_user ? "bg-pink-500 hover:bg-pink-600" : ""}
                      >
                        <Heart className={`w-4 h-4 mr-1 ${thread.liked_by_user ? "fill-current" : ""}`} />
                        {thread.likes}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowReportDialog(true)}
                      >
                        <Flag className="w-4 h-4 mr-1" />
                        Report
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{thread.content}</p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">
                  Replies ({replies.length})
                </h2>
                
                {replies.length > 0 ? (
                  <div className="space-y-4">
                    {replies.map((reply) => (
                      <Card key={reply.id}>
                        <CardHeader className="py-3">
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">
                              {reply.author} · {reply.created_at}
                            </p>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2">
                          <p className="whitespace-pre-wrap">{reply.content}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-gray-50">
                    <CardContent className="text-center py-8">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p className="text-gray-500">No replies yet. Be the first to reply!</p>
                    </CardContent>
                  </Card>
                )}
                
                <Card className="mt-6">
                  <CardHeader>
                    <h3 className="text-lg font-medium">Add a Reply</h3>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Write your reply here..."
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button
                      onClick={handleAddReply}
                      disabled={isSubmitting || !newReply.trim()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? "Posting..." : "Post Reply"}
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Thread not found.</p>
              <Button 
                variant="outline" 
                onClick={() => navigate("/forum")}
                className="mt-4"
              >
                Return to Forum
              </Button>
            </div>
          )}
        </div>
      </main>

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
              onClick={() => setShowReportDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleReportThread}
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

export default ThreadDetailPage;
