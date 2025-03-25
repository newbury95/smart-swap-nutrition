
import React from 'react';
import { Crown } from 'lucide-react';

const OffersPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-gradient-to-r from-amber-100/50 to-amber-300/30 p-8 rounded-xl shadow-md border border-amber-200 max-w-md">
          <div className="flex justify-center mb-4">
            <Crown className="h-16 w-16 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Premium Offers & Discounts</h1>
          <p className="text-gray-600 mb-6">
            We're working hard to bring you exclusive deals and special offers from our partners.
          </p>
          <div className="bg-amber-100 text-amber-800 p-4 rounded-lg inline-block font-semibold">
            Coming Soon
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersPage;
