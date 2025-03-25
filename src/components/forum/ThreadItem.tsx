
import { Heart, MessageSquare, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExtendedForumThread } from "./types/forum-types";

interface ThreadItemProps {
  thread: ExtendedForumThread;
  onReportThread: (threadId: string) => void;
  onClick: () => void;
}

export const ThreadItem = ({ thread, onReportThread, onClick }: ThreadItemProps) => {
  return (
    <div 
      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between">
        <div>
          <h3 className="font-medium text-lg mb-1">{thread.title}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <span>By @{thread.username} • {thread.created_at}</span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="text-gray-500 text-sm mr-3">
            <Heart className="inline w-4 h-4 mr-1 text-pink-500" />
            {thread.likes}
          </div>
          <div className="text-gray-500 text-sm mr-3">
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
  );
};
