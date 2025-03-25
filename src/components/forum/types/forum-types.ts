
import type { ForumThread } from "@/hooks/types/supabase";

export interface ThreadListProps {
  onReportThread: (threadId: string) => void;
  requireAuthForInteraction?: boolean;
}

export interface ExtendedForumThread extends ForumThread {
  author: string;
  username: string;
  replies: number;
  likes: number;
}
