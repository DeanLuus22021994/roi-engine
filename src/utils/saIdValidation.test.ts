import { validateSAID, formatSAID } from './saIdValidation';

describe('South African ID Validation', () => {
  describe('validateSAID', () => {
    test('should validate a valid SA ID number', () => {
      // Example of a valid SA ID number (note: this is a sample number, not a real person's ID)
      const result = validateSAID('9001085012088');
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.gender).toBe('Male');
      expect(result.citizenshipStatus).toBe('Citizen');
      expect(result.birthDate).toBeInstanceOf(Date);
      expect(result.birthDate?.getFullYear()).toBe(1990);
      expect(result.birthDate?.getMonth()).toBe(0); // January (zero-indexed)
      expect(result.birthDate?.getDate()).toBe(8);
    });

    test('should reject invalid length', () => {
      const result = validateSAID('90010850120');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('ID number must be exactly 13 digits');
    });

    test('should reject non-numeric characters', () => {
      const result = validateSAID('90010850120X8');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('ID number must contain only digits');
    });

    test('should reject invalid date', () => {
      // ID with invalid month (13)
      const result = validateSAID('9013085012083');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid date of birth in ID number');
    });

    test('should reject invalid checksum', () => {
      // Changed last digit to make checksum invalid
      const result = validateSAID('9001085012087');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('ID number has an invalid checksum');
    });

    test('should identify female gender correctly', () => {
      // Female ID (gender code is below 5000)
      const result = validateSAID('9001084800087');
      
      expect(result.isValid).toBe(true);
      expect(result.gender).toBe('Female');
    });

    test('should identify permanent resident correctly', () => {
      // Permanent resident (citizenship digit is 1)
      const result = validateSAID('9001085012185');
      
      expect(result.isValid).toBe(true);
      expect(result.citizenshipStatus).toBe('Permanent Resident');
    });
  });

  describe('formatSAID', () => {
    test('should format a valid ID with spaces', () => {
      const formatted = formatSAID('9001085012088');
      expect(formatted).toBe('900108 5012 088');
    });

    test('should return the original ID if invalid length', () => {
      const formatted = formatSAID('90010850');
      expect(formatted).toBe('90010850');
    });
  });
});