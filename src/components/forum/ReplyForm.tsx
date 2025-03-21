
import { useState } from "react";
import { Send } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReplyFormProps {
  onSubmit: (content: string) => Promise<void>;
  isSubmitting: boolean;
}

export const ReplyForm = ({ onSubmit, isSubmitting }: ReplyFormProps) => {
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (content.trim()) {
      await onSubmit(content);
      setContent("");
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <h3 className="text-lg font-medium">Add a Reply</h3>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Write your reply here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="resize-none"
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !content.trim()}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSubmitting ? "Posting..." : "Post Reply"}
          <Send className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};
