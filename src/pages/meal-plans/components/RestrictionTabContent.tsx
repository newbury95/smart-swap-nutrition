
import React from 'react';
import DietaryRestrictionCard from './DietaryRestrictionCard';

const dietaryRestrictions = [
  "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Low-Carb", "Diabetic-Friendly"
];

const RestrictionTabContent: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {dietaryRestrictions.map((restriction, idx) => (
        <DietaryRestrictionCard
          key={restriction}
          restriction={restriction}
          index={idx}
        />
      ))}
    </div>
  );
};

export default RestrictionTabContent;
