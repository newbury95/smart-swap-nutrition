import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ThreadDetail } from "@/components/forum/ThreadDetail";
import { ReplyList } from "@/components/forum/ReplyList";
import { ReplyForm } from "@/components/forum/ReplyForm";
import { ThreadDetailReportDialog } from "@/components/forum/ThreadDetailReportDialog";
import { generateUsername } from "@/utils/userNameGenerator";
import { Skeleton } from "@/components/ui/skeleton";

export interface ThreadType {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  author: string;
  username: string;
  likes: number;
  liked_by_user: boolean;
}

export interface ReplyType {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  author: string;
  username: string;
}

const ThreadDetailPage = () => {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [thread, setThread] = useState<ThreadType | null>(null);
  const [replies, setReplies] = useState<ReplyType[]>([]);
  const [showReportDialog, setShowReportDialog] = useState(false);
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
        
        const username = authorData 
          ? generateUsername(authorData.first_name, authorData.last_name)
          : 'anonymous';
        
        setThread({
          ...threadData,
          author: authorName,
          username: username,
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
          
          const replyUsername = replyAuthorData
            ? generateUsername(replyAuthorData.first_name, replyAuthorData.last_name)
            : 'anonymous';
          
          return {
            ...reply,
            author: replyAuthorName,
            username: replyUsername,
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

  const handleAddReply = async (content: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to reply to a thread."
      });
      navigate("/auth");
      return;
    }
    
    if (!content.trim()) {
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
          content: content,
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
      
      const username = profileData
        ? generateUsername(profileData.first_name, profileData.last_name)
        : 'anonymous';
      
      // Add the new reply to the state
      const newReplyObj = {
        id: data.id,
        content: data.content,
        user_id: data.user_id,
        created_at: format(new Date(), 'PP'),
        author: authorName,
        username: username
      };
      
      setReplies(prev => [...prev, newReplyObj]);
      
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
          .insert({
            thread_id: threadId,
            user_id: user.id
          });
        
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

  const handleReportThread = async (reason: string, email: string) => {
    try {
      setIsSubmitting(true);
      
      // Store the report in the database
      if (user) {
        const { error } = await supabase
          .from('forum_reports')
          .insert({
            thread_id: threadId,
            user_id: user.id,
            reason: reason
          });
        
        if (error) throw error;
      }
      
      // Send email to contact@nutritrack.co.uk with the report details
      console.log(`Sending report email:
        Thread ID: ${threadId}
        Reason: ${reason}
        Reporter: ${email || (user ? user.email : 'Anonymous')}
      `);
      
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
            <div className="space-y-6">
              <Skeleton className="h-48 w-full rounded-lg" />
              <div>
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full rounded-lg" />
                  <Skeleton className="h-32 w-full rounded-lg" />
                </div>
              </div>
            </div>
          ) : thread ? (
            <div className="space-y-6">
              <ThreadDetail 
                thread={thread} 
                onLike={handleLikeThread} 
                onReport={() => setShowReportDialog(true)} 
              />
              
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">
                  Replies ({replies.length})
                </h2>
                
                <ReplyList replies={replies} />
                
                <ReplyForm 
                  onSubmit={handleAddReply}
                  isSubmitting={isSubmitting}
                />
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

      <ThreadDetailReportDialog 
        open={showReportDialog} 
        onOpenChange={setShowReportDialog}
        onSubmit={handleReportThread}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ThreadDetailPage;
