
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignupFormData } from "../hooks/useSignup";

interface PersonalInfoFormProps {
  formData: SignupFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePremiumToggle: (checked: boolean) => void;
}

export const PersonalInfoForm = ({ formData, handleInputChange, handlePremiumToggle }: PersonalInfoFormProps) => {
  return (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="firstName" className="mb-2">
            First Name
          </Label>
          <Input
            id="firstName"
            type="text"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="lastName" className="mb-2">
            Last Name
          </Label>
          <Input
            id="lastName"
            type="text"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="email" className="mb-2">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="password" className="mb-2">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="nickname" className="mb-2">
            Nickname
          </Label>
          <Input
            id="nickname"
            type="text"
            name="nickname"
            required
            value={formData.nickname}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="dateOfBirth" className="mb-2">
            Date of Birth
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            name="dateOfBirth"
            required
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="height" className="mb-2">
            Starting Height (cm)
          </Label>
          <Input
            id="height"
            type="number"
            name="height"
            required
            value={formData.height}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="weight" className="mb-2">
            Starting Weight (kg)
          </Label>
          <Input
            id="weight"
            type="number"
            name="weight"
            required
            value={formData.weight}
            onChange={handleInputChange}
            className="w-full"
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
