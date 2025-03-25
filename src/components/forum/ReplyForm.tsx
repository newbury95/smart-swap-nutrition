
import { useState } from "react";
import { Send, LogIn } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

interface ReplyFormProps {
  onSubmit: (content: string) => Promise<void>;
  isSubmitting: boolean;
  isLoggedIn?: boolean;
}

export const ReplyForm = ({ onSubmit, isSubmitting, isLoggedIn = true }: ReplyFormProps) => {
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (content.trim()) {
      await onSubmit(content);
      setContent("");
    }
  };
  
  const redirectToLogin = () => {
    navigate("/auth");
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <h3 className="text-lg font-medium">Add a Reply</h3>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder={isLoggedIn ? "Write your reply here..." : "Log in to write a reply..."}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="resize-none"
          disabled={!isLoggedIn}
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        {isLoggedIn ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? "Posting..." : "Post Reply"}
            <Send className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={redirectToLogin}
            className="bg-primary hover:bg-primary-dark"
          >
            Log in to reply
            <LogIn className="w-4 h-4 ml-2" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
