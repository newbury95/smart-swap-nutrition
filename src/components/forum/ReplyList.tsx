
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import type { ReplyType } from "@/pages/forum/ThreadDetailPage";

interface ReplyListProps {
  replies: ReplyType[];
}

export const ReplyList = ({ replies }: ReplyListProps) => {
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
  );
};
