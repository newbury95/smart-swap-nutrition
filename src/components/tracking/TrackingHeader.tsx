
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TrackingHeader = () => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
    </header>
  );
};

export default TrackingHeader;
