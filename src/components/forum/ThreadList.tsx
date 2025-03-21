
import { useState, useEffect } from "react";
import { Flag, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import type { ForumThread } from "@/hooks/types/supabase";

interface ThreadListProps {
  onReportThread: (threadId: string) => void;
}

export const ThreadList = ({ onReportThread }: ThreadListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const viewThread = (threadId: string) => {
    navigate(`/forum/thread/${threadId}`);
  };

  return (
    <>
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
                      onReportThread(thread.id);
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
    </>
  );
};
