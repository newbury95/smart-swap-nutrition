
import { useState } from "react";
import { Heart, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import type { ThreadType } from "@/pages/forum/ThreadDetailPage";

interface ThreadDetailProps {
  thread: ThreadType;
  onLike: () => Promise<void>;
  onReport: () => void;
}

export const ThreadDetail = ({ thread, onLike, onReport }: ThreadDetailProps) => {
  return (
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
              onClick={onLike}
              className={thread.liked_by_user ? "bg-pink-500 hover:bg-pink-600" : ""}
            >
              <Heart className={`w-4 h-4 mr-1 ${thread.liked_by_user ? "fill-current" : ""}`} />
              {thread.likes}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onReport}
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
  );
};
