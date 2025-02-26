
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const MealPlansPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <h1 className="text-2xl font-semibold">Premium Meal Plans</h1>
              <Crown className="text-yellow-500 w-6 h-6" />
            </div>
            
            <p className="text-gray-600 mb-8">
              Get personalized meal plans tailored to your goals and preferences.
              This premium feature is coming soon!
            </p>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/premium-upgrade')}
            >
              Upgrade to Premium
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MealPlansPage;
