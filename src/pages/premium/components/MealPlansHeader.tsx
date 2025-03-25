
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface MealPlansHeaderProps {
  title?: string;
}

const MealPlansHeader: React.FC<MealPlansHeaderProps> = ({ title = "Meal Plans" }) => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <h1 className="text-xl font-semibold text-primary">{title}</h1>
      </div>
    </header>
  );
};

export default MealPlansHeader;
