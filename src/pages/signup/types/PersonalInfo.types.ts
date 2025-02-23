
export interface PersonalInfoForm {
  firstName: string;
  lastName: string;
  email: string;
  nickname: string;
  dateOfBirth: string;
  height: string;
  heightUnit: "cm" | "ft";
  weight: string;
  weightUnit: "kg" | "st";
  isPremium: boolean;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

