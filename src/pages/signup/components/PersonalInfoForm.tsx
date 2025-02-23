
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PersonalInfoForm as PersonalInfoFormType } from "../types/PersonalInfo.types";

interface PersonalInfoFormProps {
  formData: PersonalInfoFormType;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePremiumToggle: (checked: boolean) => void;
  handleUnitToggle: (type: "height" | "weight") => void;
  convertHeight: (value: string, from: "cm" | "ft") => string;
  convertWeight: (value: string, from: "kg" | "st") => string;
}

export const PersonalInfoForm = ({ 
  formData, 
  handleInputChange, 
  handlePremiumToggle,
  handleUnitToggle,
  convertHeight,
  convertWeight
}: PersonalInfoFormProps) => {
  return (
    <>
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

      <div className="grid md:grid-cols-2 gap-6">
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
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            required
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Starting Height
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">cm</span>
              <Switch
                checked={formData.heightUnit === "ft"}
                onCheckedChange={() => handleUnitToggle("height")}
              />
              <span className="text-sm text-gray-600">ft</span>
            </div>
          </div>
          <input
            type="number"
            name="height"
            required
            value={formData.height}
            onChange={(e) => {
              const newValue = e.target.value;
              e.target.value = convertHeight(newValue, formData.heightUnit);
              handleInputChange(e);
            }}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent"
            step={formData.heightUnit === "cm" ? "1" : "0.01"}
            min="0"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Starting Weight
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">kg</span>
              <Switch
                checked={formData.weightUnit === "st"}
                onCheckedChange={() => handleUnitToggle("weight")}
              />
              <span className="text-sm text-gray-600">st</span>
            </div>
          </div>
          <input
            type="number"
            name="weight"
            required
            value={formData.weight}
            onChange={(e) => {
              const newValue = e.target.value;
              e.target.value = convertWeight(newValue, formData.weightUnit);
              handleInputChange(e);
            }}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-transparent"
            step={formData.weightUnit === "kg" ? "0.1" : "0.01"}
            min="0"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Membership Plan</h3>
            <p className="text-sm text-gray-500">Choose between our free and premium plans</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Free</span>
            <Switch
              checked={formData.isPremium}
              onCheckedChange={handlePremiumToggle}
            />
            <span className="text-sm font-medium text-green-600">Premium £7.99/mo</span>
          </div>
        </div>
      </div>
    </>
  );
};
