
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface PersonalInfoForm {
  firstName: string;
  lastName: string;
  email: string;
  nickname: string;
  height: number;
  weight: number;
  isMetric: boolean;
}

const PersonalInfo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<PersonalInfoForm>({
    firstName: "",
    lastName: "",
    email: "",
    nickname: "",
    height: 0,
    weight: 0,
    isMetric: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    toast({
      title: "Success!",
      description: "Your profile has been created.",
    });
    navigate("/diary"); // We'll create this route later
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-soft-green/20 to-white">
      <div className="container mx-auto px-4 py-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Personal Information
          </h1>
          <p className="text-gray-600 text-center mb-12">
            Help us personalize your experience
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nickname
              </label>
              <input
                type="text"
                name="nickname"
                required
                value={formData.nickname}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Physical Metrics</h3>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Units:</label>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isMetric: true }))}
                    className={`px-3 py-1 rounded-l-lg ${formData.isMetric 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 text-gray-600'}`}
                  >
                    Metric
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isMetric: false }))}
                    className={`px-3 py-1 rounded-r-lg ${!formData.isMetric 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 text-gray-600'}`}
                  >
                    Imperial
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height {formData.isMetric ? '(cm)' : '(ft)'}
                  </label>
                  <input
                    type="number"
                    name="height"
                    required
                    value={formData.height || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight {formData.isMetric ? '(kg)' : '(lbs)'}
                  </label>
                  <input
                    type="number"
                    name="weight"
                    required
                    value={formData.weight || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button 
                type="submit"
                className="bg-gradient-to-r from-green-600 to-green-400 text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Create Profile
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PersonalInfo;
