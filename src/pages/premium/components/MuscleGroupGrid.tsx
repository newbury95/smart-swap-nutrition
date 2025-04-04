
import React from 'react';
import { Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export interface MuscleGroup {
  id: string;
  name: string;
  icon: string;
}

interface MuscleGroupGridProps {
  muscleGroups: MuscleGroup[];
  isPremium: boolean;
  onMuscleGroupSelect: (id: string) => void;
  selectedMuscleGroup?: string;
}

const MuscleGroupGrid: React.FC<MuscleGroupGridProps> = ({ 
  muscleGroups, 
  isPremium, 
  onMuscleGroupSelect,
  selectedMuscleGroup 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleMuscleClick = (muscleId: string) => {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Upgrade to Premium to access workout plans",
        variant: "destructive",
      });
      navigate('/premium-upgrade');
      return;
    }
    onMuscleGroupSelect(muscleId);
  };

  return (
    <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
      {muscleGroups.map((muscle) => (
        <button
          key={muscle.id}
          onClick={() => handleMuscleClick(muscle.id)}
          className={`
            p-2 rounded-lg text-center transition-all
            ${isPremium 
              ? selectedMuscleGroup === muscle.id 
                ? 'bg-soft-green shadow-md border border-primary-light/40' 
                : 'hover:bg-soft-green hover:shadow-sm bg-white border border-gray-200' 
              : 'relative opacity-75 bg-gray-100 border border-gray-200'}
          `}
        >
          <div className="text-lg mb-1">{muscle.icon}</div>
          <h3 className="text-xs font-medium">{muscle.name}</h3>
          
          {!isPremium && (
            <div className="absolute top-1 right-1 text-primary">
              <Crown className="w-3 h-3" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default MuscleGroupGrid;
