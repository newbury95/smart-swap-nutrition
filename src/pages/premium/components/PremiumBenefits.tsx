
import { Crown } from "lucide-react";

const PremiumBenefits = () => {
  const benefits = [
    "Personalized meal plans",
    "Advanced nutrition tracking",
    "Premium workout plans",
    "Custom foods and recipes",
    "Health app integration (Apple Health & Samsung Health)",
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-medium mb-4">Benefits include:</h2>
      <ul className="space-y-3">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-yellow-500" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PremiumBenefits;
