
import { motion } from "framer-motion";

export const SponsorBanner = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Proudly partnered with:</p>
          <div className="flex items-center gap-8">
            {["Gymshark", "Myprotein", "Maxinutrition", "Musclefood"].map((brand) => (
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
  );
};
