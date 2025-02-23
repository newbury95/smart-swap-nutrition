
export const convertHeight = (value: string, from: "cm" | "ft"): string => {
  if (!value) return "";
  const numValue = parseFloat(value);
  if (from === "cm") {
    return (numValue / 30.48).toFixed(2); // Convert cm to feet
  } else {
    return Math.round(numValue * 30.48).toString(); // Convert feet to cm
  }
};

export const convertWeight = (value: string, from: "kg" | "st"): string => {
  if (!value) return "";
  const numValue = parseFloat(value);
  if (from === "kg") {
    return (numValue / 6.35029318).toFixed(2); // Convert kg to stone
  } else {
    return (numValue * 6.35029318).toFixed(1); // Convert stone to kg
  }
};
