
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Heart, Scale, Activity, Check } from "lucide-react";

const Index = () => {
  const [isVisible, setIsVisible] = useState(true);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-soft-blue/20 to-soft-purple/30">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="px-4 py-2 bg-gradient-to-r from-soft-purple to-soft-blue rounded-full text-sm font-medium inline-block mb-6 shadow-sm">
            Smart Nutrition Made Simple
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Transform Your Diet with Intelligent Food Swaps
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Personalized nutrition recommendations based on your health conditions and goals. 
            Get healthier alternatives without sacrificing taste.
          </p>
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl">
            Start Your Journey
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-soft-blue/20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Smart Swaps for Better Health
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our intelligent system suggests personalized food alternatives based on your specific needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-purple-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <feature.icon className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Health Conditions Section */}
      <section className="py-24 bg-gradient-to-br from-soft-purple/20 to-soft-blue/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Tailored to Your Needs
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get personalized recommendations based on your health conditions and goals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {conditions.map((condition, index) => (
              <motion.div
                key={condition.name}
                className="p-6 rounded-2xl bg-white/90 backdrop-blur-sm border border-purple-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full text-sm font-medium mb-4">
                  {condition.category}
                </span>
                <h3 className="text-xl font-semibold mb-2">{condition.name}</h3>
                <p className="text-gray-600 mb-4">{condition.description}</p>
                <ul className="space-y-2">
                  {condition.swaps.map((swap, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-purple-500" />
                      {swap}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-white to-soft-purple/20">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Ready to Transform Your Diet?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of users who have discovered healthier alternatives to their favorite foods.
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl">
              Get Started Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    icon: Leaf,
    title: "Smart Swaps",
    description: "Get intelligent food alternatives based on your nutritional needs and preferences"
  },
  {
    icon: Heart,
    title: "Health First",
    description: "Recommendations tailored to your specific health conditions and goals"
  },
  {
    icon: Scale,
    title: "Track Progress",
    description: "Monitor your journey with detailed nutritional insights and progress tracking"
  },
  {
    icon: Activity,
    title: "Active Support",
    description: "Receive ongoing guidance and adjustments as your needs change"
  }
];

const conditions = [
  {
    category: "Health Condition",
    name: "Diabetes Management",
    description: "Smart alternatives to help maintain healthy blood sugar levels",
    swaps: [
      "Replace white rice with cauliflower rice",
      "Swap regular pasta for zucchini noodles",
      "Choose sweet potatoes over white potatoes"
    ]
  },
  {
    category: "Fitness Goal",
    name: "Muscle Gain",
    description: "Protein-rich alternatives to support muscle growth",
    swaps: [
      "Replace regular yogurt with Greek yogurt",
      "Swap bread for quinoa",
      "Choose lean meats over processed options"
    ]
  },
  {
    category: "Dietary Need",
    name: "Heart Health",
    description: "Heart-friendly alternatives for your favorite foods",
    swaps: [
      "Replace butter with avocado",
      "Swap red meat for fatty fish",
      "Choose whole grains over refined grains"
    ]
  }
];

export default Index;
