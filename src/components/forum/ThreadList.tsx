
import { useNavigate } from "react-router-dom";
import { ThreadListProps } from "./types/forum-types";
import { useThreadList } from "./hooks/useThreadList";
import { ThreadItem } from "./ThreadItem";
import { ThreadListLoading } from "./ThreadListLoading";
import { EmptyThreadList } from "./EmptyThreadList";

export const ThreadList = ({ onReportThread, requireAuthForInteraction = true }: ThreadListProps) => {
  const navigate = useNavigate();
  const { threads, isLoading } = useThreadList();

  const viewThread = (threadId: string) => {
    navigate(`/forum/thread/${threadId}`);
  };

  return (
    <>
      {isLoading ? (
        <ThreadListLoading />
      ) : threads.length > 0 ? (
        <div className="space-y-4">
          {threads.map((thread) => (
            <ThreadItem 
              key={thread.id} 
              thread={thread} 
              onReportThread={onReportThread}
              onClick={() => viewThread(thread.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyThreadList />
      )}
    </>
  );
};
