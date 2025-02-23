
export const convertHeight = (value: string, from: "cm" | "ft"): string => {
  if (!value || isNaN(parseFloat(value))) return "0";
  
  const numValue = parseFloat(value);
  if (from === "cm") {
    // Convert cm to feet
    return (numValue / 30.48).toFixed(2);
  } else {
    // Convert feet to cm
    return Math.round(numValue * 30.48).toString();
  }
};

export const convertWeight = (value: string, from: "kg" | "st"): string => {
  if (!value || isNaN(parseFloat(value))) return "0";
  
  const numValue = parseFloat(value);
  if (from === "kg") {
    // Convert kg to stone
    return (numValue / 6.35029318).toFixed(2);
  } else {
    // Convert stone to kg
    return (numValue * 6.35029318).toFixed(1);
  }
};
