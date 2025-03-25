
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { generateUsername } from "@/utils/userNameGenerator";
import { ExtendedForumThread } from "../types/forum-types";

export const useThreadList = () => {
  const { toast } = useToast();
  const [threads, setThreads] = useState<ExtendedForumThread[]>([]);
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
        
        const threadsWithDetails = await Promise.all(threadsData?.map(async (thread) => {
          // Count replies
          const { count: replyCount, error: countError } = await supabase
            .from('forum_replies')
            .select('*', { count: 'exact', head: true })
            .eq('thread_id', thread.id);
          
          if (countError) {
            console.error('Error counting replies:', countError);
            return {
              ...thread,
              author: 'Anonymous',
              username: 'anonymous',
              replies: 0,
              likes: 0
            };
          }
          
          // Count likes
          const { count: likeCount, error: likeError } = await supabase
            .from('forum_likes')
            .select('*', { count: 'exact', head: true })
            .eq('thread_id', thread.id);
            
          if (likeError) {
            console.error('Error counting likes:', likeError);
            return {
              ...thread,
              author: 'Anonymous',
              username: 'anonymous',
              replies: replyCount || 0,
              likes: 0
            };
          }
          
          let authorName = 'Anonymous';
          let username = 'anonymous';
          try {
            // Check if username column exists before trying to select it
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('first_name, last_name')
              .eq('id', thread.user_id)
              .maybeSingle();
            
            if (!profileError && profileData) {
              authorName = `${profileData.first_name} ${profileData.last_name}`;
              username = generateUsername(profileData.first_name, profileData.last_name);
            }
          } catch (err) {
            console.error('Error fetching profile data:', err);
          }
          
          return {
            ...thread,
            author: authorName,
            username: username,
            replies: replyCount || 0,
            likes: likeCount || 0
          };
        }) || []);
        
        const formattedThreads = threadsWithDetails.map(thread => ({
          id: thread.id,
          title: thread.title,
          content: thread.content,
          user_id: thread.user_id,
          created_at: format(new Date(thread.created_at), 'PP'),
          author: thread.author,
          username: thread.username,
          replies: thread.replies,
          likes: thread.likes
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

  return {
    threads,
    isLoading
  };
};
