
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface DifficultyTabsProps {
  selectedDifficulty: string;
  onSelectDifficulty: (difficulty: string) => void;
}

const DifficultyTabs: React.FC<DifficultyTabsProps> = ({ 
  selectedDifficulty, 
  onSelectDifficulty 
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-4">Filter by Difficulty</h2>
      <Tabs value={selectedDifficulty} onValueChange={onSelectDifficulty}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default DifficultyTabs;
