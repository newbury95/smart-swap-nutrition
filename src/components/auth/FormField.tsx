
import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export const FormField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = "",
  icon,
  disabled = false,
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={icon ? "flex items-center gap-2" : ""}>
        {icon}
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};
