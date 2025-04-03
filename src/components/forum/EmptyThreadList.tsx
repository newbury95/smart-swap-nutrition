
import { MessageSquare } from "lucide-react";

export const EmptyThreadList = () => {
  return (
    <div className="text-center py-12 text-gray-500">
      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" aria-hidden="true" role="img" />
      <p>No blogs yet. Be the first to start a conversation!</p>
    </div>
  );
};
