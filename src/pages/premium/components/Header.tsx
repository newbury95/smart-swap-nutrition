
import React from 'react';
import { ChevronLeft, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  isPremium: boolean;
  onBackClick?: () => void;
  backLink?: string;
  backText?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  isPremium, 
  onBackClick, 
  backLink = '/dashboard',
  backText = 'Back to Dashboard'
}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else if (backLink) {
      navigate(backLink);
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {isPremium && <Crown className="text-yellow-500 w-6 h-6" />}
      </div>
      
      {(backLink || onBackClick) && (
        <button
          onClick={handleBackClick}
          className="text-sm flex items-center gap-1 text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft className="w-4 h-4" />
          {backText}
        </button>
      )}
    </div>
  );
};

export default Header;
