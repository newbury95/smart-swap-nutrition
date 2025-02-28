
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WorkoutList from './WorkoutList';
import { Workout, Difficulty } from './WorkoutCard';

interface DifficultyTabsProps {
  workouts: Workout[];
  onDifficultyChange: (difficulty: Difficulty) => void;
}

const DifficultyTabs: React.FC<DifficultyTabsProps> = ({ workouts, onDifficultyChange }) => {
  return (
    <Tabs defaultValue="beginner" onValueChange={(value) => onDifficultyChange(value as Difficulty)}>
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="beginner">Beginner</TabsTrigger>
        <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>
      
      {['beginner', 'intermediate', 'advanced'].map((level) => (
        <TabsContent key={level} value={level}>
          <WorkoutList 
            workouts={workouts} 
            difficulty={level as Difficulty} 
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default DifficultyTabs;
