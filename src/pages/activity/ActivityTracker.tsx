
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ActivityTracker = () => {
  const { toast } = useToast();
  const [steps, setSteps] = useState(0);
  const [exercise, setExercise] = useState(0);

  const handleUpdateSteps = () => {
    setSteps(prev => prev + 1000);
    toast({
      title: "Activity Logged",
      description: "Your steps have been recorded for the day",
    });
  };

  const handleUpdateExercise = () => {
    setExercise(prev => prev + 30);
    toast({
      title: "Exercise Logged",
      description: "Your exercise minutes have been recorded for the day",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h1 className="text-2xl font-semibold mb-6">Activity Tracking</h1>
            
            <div className="space-y-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <h2 className="text-lg font-medium mb-1">Current BMI</h2>
                <p className="text-2xl font-bold text-green-600">24.5</p>
              </div>

              <Tabs defaultValue="steps" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="steps">Steps</TabsTrigger>
                  <TabsTrigger value="exercise">Exercise</TabsTrigger>
                </TabsList>

                <TabsContent value="steps" className="space-y-4">
                  <div className="p-6 bg-white border rounded-lg">
                    <h3 className="text-xl font-medium mb-2">Today's Steps</h3>
                    <p className="text-3xl font-bold text-green-600 mb-4">{steps}</p>
                    <Button onClick={handleUpdateSteps}>Log Steps</Button>
                  </div>
                </TabsContent>

                <TabsContent value="exercise" className="space-y-4">
                  <div className="p-6 bg-white border rounded-lg">
                    <h3 className="text-xl font-medium mb-2">Exercise Minutes</h3>
                    <p className="text-3xl font-bold text-green-600 mb-4">{exercise} min</p>
                    <Button onClick={handleUpdateExercise}>Log Exercise</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ActivityTracker;
