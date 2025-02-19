
import { Switch } from "@/components/ui/switch";

interface PersonalInfoFormProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    nickname: string;
    isPremium: boolean;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePremiumToggle: (checked: boolean) => void;
}

export const PersonalInfoForm = ({ formData, handleInputChange, handlePremiumToggle }: PersonalInfoFormProps) => {
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
