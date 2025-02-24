
import { Crown, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";

const WorkoutPlansPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <h1 className="text-2xl font-semibold">Premium Workout Plans</h1>
              <Crown className="text-yellow-500 w-6 h-6" />
            </div>
            
            <div className="grid gap-6">
              <div className="p-6 bg-green-50 rounded-lg flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl">
                  <Dumbbell className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium mb-2">Personalized Workouts</h3>
                  <p className="text-gray-600">
                    Get customized workout plans based on your fitness level and goals.
                    This premium feature is coming soon!
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button variant="outline">Upgrade to Premium</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkoutPlansPage;
