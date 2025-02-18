
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Heart, Activity, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";

type GoalType = "health" | "fitness" | "dietary";

interface GoalOption {
  id: GoalType;
  title: string;
  description: string;
  examples: string[];
  icon: JSX.Element;
}

const SignUp = () => {
  const navigate = useNavigate();
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null);

  const handleSelectGoal = (goalType: GoalType) => {
    setSelectedGoal(goalType);
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

          <div className="grid md:grid-cols-3 gap-6">
            {goalOptions.map((goal) => (
              <motion.div
                key={goal.id}
                className={`relative p-8 rounded-3xl backdrop-blur-sm border-2 transition-all duration-300 cursor-pointer overflow-hidden group
                  ${selectedGoal === goal.id 
                    ? 'bg-green-50/80 border-green-400 shadow-xl' 
                    : 'bg-white/80 border-gray-100 hover:border-green-200 hover:shadow-lg'}`}
                onClick={() => handleSelectGoal(goal.id)}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-10 bg-cover bg-center
                  ${goal.id === 'health' && 'bg-[url("/images/health-bg.jpg")]'}
                  ${goal.id === 'fitness' && 'bg-[url("/images/fitness-bg.jpg")]'}
                  ${goal.id === 'dietary' && 'bg-[url("/images/dietary-bg.jpg")]'}`}
                />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-2xl bg-green-50 text-green-600">
                      {goal.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{goal.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-6 text-sm">{goal.description}</p>
                  <ul className="space-y-3">
                    {goal.examples.map((example, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: selectedGoal ? 1 : 0 }}
            className="mt-12 text-center"
          >
            {selectedGoal && (
              <button 
                className="bg-gradient-to-r from-green-600 to-green-400 text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => console.log(`Selected goal: ${selectedGoal}`)}
              >
                Continue
              </button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const goalOptions: GoalOption[] = [
  {
    id: "health",
    title: "Health Condition",
    description: "Get personalized alternatives that support your health needs",
    examples: [
      "Diabetes Management",
      "Heart Health",
      "Digestive Issues",
      "Food Allergies"
    ],
    icon: <Heart className="w-6 h-6" />
  },
  {
    id: "fitness",
    title: "Fitness Goal",
    description: "Optimize your nutrition to achieve your fitness objectives",
    examples: [
      "Muscle Gain",
      "Weight Loss",
      "Athletic Performance",
      "Energy Boost"
    ],
    icon: <Activity className="w-6 h-6" />
  },
  {
    id: "dietary",
    title: "Dietary Need",
    description: "Find alternatives that align with your dietary preferences",
    examples: [
      "Vegetarian/Vegan",
      "Gluten-Free",
      "Low-Carb",
      "Mediterranean"
    ],
    icon: <Leaf className="w-6 h-6" />
  }
];

export default SignUp;
