
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import type { ReplyType } from "@/pages/forum/ThreadDetailPage";
import { Skeleton } from "@/components/ui/skeleton";

interface ReplyListProps {
  replies: ReplyType[];
  isLoading?: boolean;
}

export const ReplyList = ({ replies, isLoading = false }: ReplyListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="py-3">
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent className="py-2">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (replies.length === 0) {
    return (
      <Card className="bg-gray-50">
        <CardContent className="text-center py-8">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-gray-500">No replies yet. Be the first to reply!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {replies.map((reply) => (
        <Card key={reply.id}>
          <CardHeader className="py-3">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                @{reply.username || 'anonymous'} · {reply.created_at}
              </p>
            </div>
          </CardHeader>
          <CardContent className="py-2">
            <p className="whitespace-pre-wrap">{reply.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
