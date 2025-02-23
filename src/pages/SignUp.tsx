
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

type GoalType = "weight-loss" | "muscle-gain" | "endurance" | "general-fitness";

interface GoalOption {
  id: GoalType;
  title: string;
  description: string;
  icon: JSX.Element;
}

const goalOptions: GoalOption[] = [
  {
    id: "weight-loss",
    title: "Weight Loss",
    description: "Sustainable nutrition plans for healthy weight management",
    icon: <Activity className="w-6 h-6" />
  },
  {
    id: "muscle-gain",
    title: "Muscle Gain",
    description: "Protein-rich meal plans for building lean muscle mass",
    icon: <Activity className="w-6 h-6" />
  },
  {
    id: "endurance",
    title: "Endurance Training",
    description: "Nutrition support for enhanced athletic performance",
    icon: <Activity className="w-6 h-6" />
  },
  {
    id: "general-fitness",
    title: "General Fitness",
    description: "Balanced nutrition for overall health and wellness",
    icon: <Activity className="w-6 h-6" />
  }
];

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!selectedGoal) {
      toast({
        variant: "destructive",
        title: "Please select a goal",
        description: "You need to select a goal before continuing",
      });
      return;
    }

    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing credentials",
        description: "Please enter your email and password",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp(email, password);
      localStorage.setItem('selectedGoal', selectedGoal);
      navigate('/signup/personal-info');
    } catch (error) {
      console.error('SignUp error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-soft-green/20 to-white">
      <div className="container mx-auto px-4 py-12">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            What's Your Goal?
          </h1>
          <p className="text-gray-600 text-center mb-12">
            Select your primary focus and we'll customize your nutrition plan accordingly
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {goalOptions.map((goal) => (
              <motion.div
                key={goal.id}
                className={`relative p-6 rounded-3xl backdrop-blur-sm border-2 transition-all duration-300 cursor-pointer
                  ${selectedGoal === goal.id 
                    ? 'bg-green-50/80 border-green-400 shadow-xl' 
                    : 'bg-white/80 border-gray-100 hover:border-green-200 hover:shadow-lg'}`}
                onClick={() => setSelectedGoal(goal.id)}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-green-50 text-green-600">
                    {goal.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{goal.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{goal.description}</p>
              </motion.div>
            ))}
          </div>

          {selectedGoal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 max-w-md mx-auto space-y-4"
            >
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300"
                />
              </div>
              <button 
                className={`w-full bg-gradient-to-r from-green-600 to-green-400 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                onClick={handleContinue}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating account...' : 'Continue'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
