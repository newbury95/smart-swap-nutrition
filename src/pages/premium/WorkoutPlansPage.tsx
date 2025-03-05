
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Header from './components/Header';
import DifficultyTabs from './components/DifficultyTabs';
import WorkoutCard from './components/WorkoutCard';
import WorkoutList from './components/WorkoutList';
import { workoutData } from './data/workoutData';

const WorkoutPlansPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('all');

  useEffect(() => {
    // Simulate loading to improve perceived performance
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter workouts based on selected difficulty and muscle group
  const filteredWorkouts = React.useMemo(() => {
    return workoutData.filter(workout => {
      const difficultyMatch = selectedDifficulty === 'all' || workout.difficulty === selectedDifficulty;
      const muscleGroupMatch = selectedMuscleGroup === 'all' || 
                               workout.primaryMuscleGroups.includes(selectedMuscleGroup) ||
                               workout.secondaryMuscleGroups.includes(selectedMuscleGroup);
      return difficultyMatch && muscleGroupMatch;
    });
  }, [selectedDifficulty, selectedMuscleGroup]);

  const handleSaveWorkout = (workoutId: string) => {
    try {
      // Implementation for saving a workout would go here
      toast({
        title: "Workout saved",
        description: "This workout has been added to your saved workouts",
      });
    } catch (error) {
      console.error("Error saving workout:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save workout. Please try again.",
      });
    }
  };

  return (
    <ErrorBoundary fallback={<div className="p-4 bg-red-100 text-red-700">There was an error loading the workout plans. Please refresh the page.</div>}>
      <div className="min-h-screen bg-gray-50">
        <Header title="Workout Plans" subtitle="Discover workout routines tailored to your goals" />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
            ) : (
              <>
                <DifficultyTabs 
                  selectedDifficulty={selectedDifficulty}
                  onSelectDifficulty={setSelectedDifficulty}
                />
                
                <Tabs defaultValue="grid" className="mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Available Workouts</h2>
                    <TabsList>
                      <TabsTrigger value="grid">Grid View</TabsTrigger>
                      <TabsTrigger value="list">List View</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="grid" className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredWorkouts.map(workout => (
                        <WorkoutCard
                          key={workout.id}
                          workout={workout}
                          onSave={() => handleSaveWorkout(workout.id)}
                        />
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="list" className="mt-0">
                    <WorkoutList 
                      workouts={filteredWorkouts}
                      onSave={handleSaveWorkout}
                    />
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default WorkoutPlansPage;
