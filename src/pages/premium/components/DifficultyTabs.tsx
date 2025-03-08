
import React from 'react';

export interface DifficultyTabsProps {
  selectedDifficulty: string;
  onSelectDifficulty: (difficulty: string) => void;
}

const DifficultyTabs: React.FC<DifficultyTabsProps> = ({ 
  selectedDifficulty, 
  onSelectDifficulty 
}) => {
  const difficulties = [
    { id: "all", label: "All" },
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {difficulties.map((difficulty) => (
        <button
          key={difficulty.id}
          onClick={() => onSelectDifficulty(difficulty.id === 'all' ? null : difficulty.id)}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            selectedDifficulty === difficulty.id || (selectedDifficulty === null && difficulty.id === 'all')
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          {difficulty.label}
        </button>
      ))}
    </div>
  );
};

export default DifficultyTabs;
