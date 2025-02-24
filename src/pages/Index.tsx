
import { motion } from "framer-motion";
import { ArrowRight, LogIn, Dumbbell, Apple, Crown, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const premiumFeatures = [
    "Personalized meal plans",
    "Advanced workout tracking",
    "Premium recipes library",
    "Expert nutrition consultation",
    "Progress analytics"
  ];

  const freeFeatures = [
    "Basic meal tracking",
    "Daily food diary",
    "Basic health metrics",
    "Community forum access",
    "Email support"
  ];

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
        </motion.div>

        {/* Pricing Tiles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16"
        >
          {/* Free Plan */}
          <motion.div
            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-semibold">Free Plan</h3>
                <p className="text-gray-600 mt-2">Get started with the basics</p>
              </div>
              <span className="text-2xl font-bold text-green-600">$0</span>
            </div>
            
            <div className="space-y-4 mb-8">
              {freeFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/signup')}
              className="w-full bg-gray-100 text-gray-800 py-3 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              Try for Free
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-2 border-green-100"
            whileHover={{ y: -5 }}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-semibold">Premium</h3>
                  <Crown className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-gray-600 mt-2">Unlock all features</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-green-600">$9.99</span>
                <p className="text-sm text-gray-500">/month</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/signup')}
              className="w-full bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              Get Premium
              <Crown className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>

        {/* Feature Tiles */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
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
