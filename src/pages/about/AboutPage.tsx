
import React from "react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-6">About NutriTrack</h1>
          <p className="text-gray-700 mb-6">
            NutriTrack is a comprehensive nutrition tracking application designed to help you
            monitor your daily food intake, track calories, and achieve your health goals.
          </p>
          <p className="text-gray-700 mb-6">
            Our mission is to make nutrition tracking simple, accessible, and effective for everyone,
            whether you're looking to lose weight, gain muscle, or simply maintain a balanced diet.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Story</h2>
          <p className="text-gray-700 mb-6">
            Founded in 2023, NutriTrack was born from a passion for health and wellness. Our team
            of nutritionists, fitness experts, and developers came together to create a platform that
            combines scientific nutrition principles with user-friendly technology.
          </p>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Features</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
            <li>Comprehensive food database with thousands of items</li>
            <li>Personalized meal planning</li>
            <li>Detailed nutrition breakdowns</li>
            <li>Progress tracking and analytics</li>
            <li>Community support and forums</li>
            <li>Expert guidance and resources</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
