
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ActivityTracker = () => {
  const { toast } = useToast();
  const [steps, setSteps] = useState(0);

  const handleUpdateSteps = () => {
    toast({
      title: "Activity Logged",
      description: "Your steps have been recorded for the day",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h1 className="text-2xl font-semibold mb-6">Activity Tracking</h1>
            
            <div className="space-y-6">
              <div className="p-6 bg-green-50 rounded-lg">
                <h2 className="text-xl font-medium mb-2">Today's Steps</h2>
                <p className="text-3xl font-bold text-green-600">{steps}</p>
              </div>

              <div className="grid gap-4">
                <Button onClick={handleUpdateSteps}>Log Steps</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ActivityTracker;
