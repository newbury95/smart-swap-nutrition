
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-soft-green/20 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-green-800">
            Transform Your Diet,<br />Achieve Your Goals
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Get personalized meal suggestions and healthy food swaps tailored to your
            specific health, diet, or fitness goals.
          </p>
        </motion.div>
      </section>

      {/* Plans Section */}
      <section className="py-24 bg-gradient-to-b from-white to-soft-green/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              <h2 className="text-2xl font-bold mb-6">Free Plan Features</h2>
              <ul className="space-y-4 mb-8">
                {freePlanFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <p className="text-gray-600 mb-6">Perfect for getting started with healthy eating</p>
              <button 
                onClick={() => navigate('/signup')}
                className="w-full bg-white border-2 border-green-500 text-green-500 hover:bg-green-50 px-6 py-3 rounded-full font-medium transition-colors flex items-center justify-center gap-2"
              >
                Try for Free
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-green-50 rounded-2xl p-8 shadow-lg border border-green-100"
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">Premium Plan</h2>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  £7.99/month
                </span>
              </div>
              <ul className="space-y-4 mb-8">
                {premiumPlanFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <p className="text-gray-600 mb-6">For those serious about their health goals</p>
              <button 
                onClick={() => navigate('/signup?plan=premium')}
                className="w-full bg-green-500 text-white hover:bg-green-600 px-6 py-3 rounded-full font-medium transition-colors flex items-center justify-center gap-2"
              >
                Get Premium Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

const freePlanFeatures = [
  "Daily meal tracking",
  "Smart food swap suggestions",
  "Water intake tracking",
  "Basic progress monitoring"
];

const premiumPlanFeatures = [
  "All Free Plan Features",
  "Personalized meal suggestions",
  "Weekly meal planning",
  "Advanced nutrition insights",
  "Premium recipe collection"
];

export default Index;
