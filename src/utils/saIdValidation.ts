/**
 * South African ID Number Validation Utility
 * 
 * Format: YYMMDD SSSS 0 Z C
 * - YYMMDD: Date of birth
 * - SSSS: Gender (Female: 0000-4999, Male: 5000-9999)
 * - 0: Citizen Status (0: SA Citizen, 1: Permanent Resident)
 * - Z: Race (was used during apartheid, now filled with 8)
 * - C: Checksum digit
 */

/**
 * Validates a South African ID number
 * @param idNumber The ID number to validate
 * @returns An object containing validation result and any errors
 */
export const validateSAID = (idNumber: string): { 
  isValid: boolean; 
  errors: string[];
  birthDate?: Date;
  gender?: 'Male' | 'Female';
  citizenshipStatus?: 'Citizen' | 'Permanent Resident';
} => {
  const errors: string[] = [];
  
  // Basic format check
  if (!idNumber || typeof idNumber !== 'string') {
    errors.push('ID number must be a non-empty string');
    return { isValid: false, errors };
  }

  // Check length
  if (idNumber.length !== 13) {
    errors.push('ID number must be exactly 13 digits');
    return { isValid: false, errors };
  }

  // Check if all characters are digits
  if (!/^\d+$/.test(idNumber)) {
    errors.push('ID number must contain only digits');
    return { isValid: false, errors };
  }

  // Extract components
  const year = parseInt(idNumber.substring(0, 2));
  const month = parseInt(idNumber.substring(2, 4));
  const day = parseInt(idNumber.substring(4, 6));
  const gender = parseInt(idNumber.substring(6, 10));
  const citizenship = parseInt(idNumber.substring(10, 11));
  const checksum = parseInt(idNumber.substring(12, 13));

  // Validate date
  const fullYear = year < 50 ? 2000 + year : 1900 + year; // Adjust for century
  const birthDate = new Date(fullYear, month - 1, day);
  
  if (
    birthDate.getFullYear() !== fullYear ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    errors.push('Invalid date of birth in ID number');
  }

  // Validate citizenship
  if (citizenship !== 0 && citizenship !== 1) {
    errors.push('Citizenship digit must be 0 or 1');
  }

  // Validate checksum using Luhn algorithm
  let sum = 0;
  let alternate = false;
  for (let i = idNumber.length - 2; i >= 0; i--) {
    let digit = parseInt(idNumber.charAt(i));
    
    if (alternate) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    alternate = !alternate;
  }

  const calculatedChecksum = (10 - (sum % 10)) % 10;
  if (calculatedChecksum !== checksum) {
    errors.push('ID number has an invalid checksum');
  }

  // Determine details if valid
  let genderValue: 'Male' | 'Female' | undefined;
  let citizenshipStatus: 'Citizen' | 'Permanent Resident' | undefined;

  if (errors.length === 0) {
    genderValue = gender >= 5000 ? 'Male' : 'Female';
    citizenshipStatus = citizenship === 0 ? 'Citizen' : 'Permanent Resident';
  }

  return {
    isValid: errors.length === 0,
    errors,
    birthDate: errors.length === 0 ? birthDate : undefined,
    gender: genderValue,
    citizenshipStatus
  };
};

/**
 * Format a South African ID number with spaces for readability
 * @param idNumber The ID number to format
 * @returns Formatted ID number (e.g., "990108 5012 088")
 */
export const formatSAID = (idNumber: string): string => {
  if (!idNumber || idNumber.length !== 13) {
    return idNumber;
  }
  
  return `${idNumber.substring(0, 6)} ${idNumber.substring(6, 10)} ${idNumber.substring(10)}`;
};