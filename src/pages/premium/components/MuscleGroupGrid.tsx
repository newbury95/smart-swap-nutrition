
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
}

const MuscleGroupGrid: React.FC<MuscleGroupGridProps> = ({ 
  muscleGroups, 
  isPremium, 
  onMuscleGroupSelect 
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {muscleGroups.map((muscle) => (
        <button
          key={muscle.id}
          onClick={() => handleMuscleClick(muscle.id)}
          className={`
            p-6 rounded-lg text-center transition-all
            ${isPremium 
              ? 'hover:bg-green-50 hover:shadow-md bg-white border border-gray-200' 
              : 'opacity-50 cursor-not-allowed bg-gray-100'}
          `}
        >
          <div className="text-3xl mb-2">{muscle.icon}</div>
          <h3 className="font-medium">{muscle.name}</h3>
        </button>
      ))}
      
      {!isPremium && (
        <div className="mt-8 text-center col-span-2 md:col-span-4">
          <button 
            onClick={() => navigate('/premium-upgrade')}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            <Crown className="w-4 h-4 text-yellow-500" />
            Upgrade to Premium
          </button>
        </div>
      )}
    </div>
  );
};

export default MuscleGroupGrid;
