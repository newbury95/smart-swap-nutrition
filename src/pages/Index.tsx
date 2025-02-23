
import { motion } from "framer-motion";
import { ArrowRight, LogIn, Dumbbell, Apple } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-soft-green/20 to-white">
      {/* Top Banner */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-green-600">NutriTrack</h1>
          <button
            onClick={() => navigate('/signup')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <span>Sign In</span>
            <LogIn className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <motion.div 
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-green-800">
            Track Your Nutrition Journey
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Join our community of health enthusiasts and achieve your fitness goals
            with personalized nutrition tracking.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Feature Tiles */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ y: -5 }}
          >
            <div className="p-3 bg-green-100 rounded-xl w-fit mb-4">
              <Dumbbell className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Workout Integration</h3>
            <p className="text-gray-600">
              Sync your workouts and track your progress with our premium health metrics integration.
            </p>
          </motion.div>

          <motion.div
            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ y: -5 }}
          >
            <div className="p-3 bg-green-100 rounded-xl w-fit mb-4">
              <Apple className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Health App Sync</h3>
            <p className="text-gray-600">
              Connect with Apple Health or Samsung Health to automatically track your daily activities.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Sponsor Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Our partners:</p>
            <div className="flex items-center gap-8">
              <motion.a
                href="https://www.instagram.com/francis_fitness_official"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                Francis Fitness (PT)
              </motion.a>
              <motion.a
                href="https://www.musclefood.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                Musclefood
              </motion.a>
              {["Gymshark", "Myprotein"].map((brand) => (
                <motion.a
                  key={brand}
                  href="#"
                  className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  {brand}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
