
/**
 * Generates a username from first and last name
 * Takes first 3 characters of first name and first 3 of last name (or fewer if names are shorter)
 * Then adds a random 4-digit number
 */
export const generateUsername = (firstName: string, lastName: string): string => {
  // Handle empty names
  if (!firstName && !lastName) {
    return `user${Math.floor(1000 + Math.random() * 9000)}`;
  }
  
  // Take up to first 3 chars from first name and last name
  const firstPart = firstName ? firstName.substring(0, 3).toLowerCase() : '';
  const lastPart = lastName ? lastName.substring(0, 3).toLowerCase() : '';
  
  // Add random 4-digit number for uniqueness
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  
  return `${firstPart}${lastPart}${randomNum}`;
};
