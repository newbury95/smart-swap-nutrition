
import { Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ForumPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h1 className="text-2xl font-semibold mb-6">Community Forum</h1>
            <p className="text-gray-600 mb-8">
              Connect with other members, share your journey, and get support from the community.
              This feature is coming soon!
            </p>
            <Button
              onClick={() => navigate('/diary')}
              variant="outline"
            >
              Return to Food Diary
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForumPage;
