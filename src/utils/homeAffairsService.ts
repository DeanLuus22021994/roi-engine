/**
 * Interface for Home Affairs API responses
 */
export interface HomeAffairsAPIResponse {
  isValid: boolean;
  status: 'success' | 'error';
  message?: string;
  idDetails?: {
    birthDate: string;
    gender: 'Male' | 'Female';
    citizenshipStatus: 'Citizen' | 'Permanent Resident';
    name?: string;
    surname?: string;
    isDeceased?: boolean;
    issuedDate?: string;
  };
}

/**
 * Service for interacting with South African Home Affairs API
 */
export class HomeAffairsService {
  private apiUrl: string;
  private apiKey: string;

  /**
   * Creates a new instance of the Home Affairs service
   * @param apiUrl Base URL for the Home Affairs API
   * @param apiKey API key for authentication
   */
  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  /**
   * Validates a South African ID number against the Home Affairs database
   * @param idNumber The ID number to validate
   * @returns Promise resolving to validation results
   */
  async verifyIdNumber(idNumber: string): Promise<HomeAffairsAPIResponse> {
    try {
      // Remove spaces or formatting if present
      const sanitizedId = idNumber.replace(/\s/g, '');
      
      const response = await fetch(`${this.apiUrl}/verify-id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-API-Key': this.apiKey
        },
        body: JSON.stringify({ idNumber: sanitizedId })
      });

      if (!response.ok) {
        // Handle HTTP errors
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Home Affairs API error:', error);
      return {
        isValid: false,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get detailed person information using ID number
   * @param idNumber The ID number to lookup
   * @returns Promise resolving to person details
   */
  async getPersonDetails(idNumber: string): Promise<HomeAffairsAPIResponse> {
    try {
      const sanitizedId = idNumber.replace(/\s/g, '');
      
      const response = await fetch(`${this.apiUrl}/person-details/${sanitizedId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-API-Key': this.apiKey
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Home Affairs API error:', error);
      return {
        isValid: false,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

// For development and testing, create a mock implementation
// This is used when the real Home Affairs API is not available
const MOCK_API_URL = process.env.NEXT_PUBLIC_HOME_AFFAIRS_API_URL || 'https://api.homeaffairs.gov.za/v1';
const MOCK_API_KEY = process.env.NEXT_PUBLIC_HOME_AFFAIRS_API_KEY || 'development_key';

// Create a singleton instance of the service
const homeAffairsService = new HomeAffairsService(MOCK_API_URL, MOCK_API_KEY);

/**
 * Verify an ID number against the Home Affairs database
 * @param idNumber The ID number to validate
 * @returns Promise with validation result
 */
export async function verifyIdNumber(idNumber: string): Promise<HomeAffairsAPIResponse> {
  // For development, simulate API response with mock data
  if (process.env.NODE_ENV === 'development') {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      isValid: true,
      status: 'success',
      message: 'ID number validation successful (MOCK)',
      idDetails: {
        birthDate: '1990-01-08',
        gender: 'Male',
        citizenshipStatus: 'Citizen'
      }
    };
  }
  
  // In production, use the real service
  return homeAffairsService.verifyIdNumber(idNumber);
}

/**
 * Get detailed information about a person using their ID number
 * @param idNumber The ID number to lookup
 * @returns Promise with person details
 */
export async function getPersonDetailsById(idNumber: string): Promise<HomeAffairsAPIResponse> {
  // For development, simulate API response with mock data
  if (process.env.NODE_ENV === 'development') {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return {
      isValid: true,
      status: 'success',
      message: 'Person details retrieved successfully (MOCK)',
      idDetails: {
        name: 'John',
        surname: 'Doe',
        birthDate: '1990-01-08',
        gender: 'Male',
        citizenshipStatus: 'Citizen',
        isDeceased: false,
        issuedDate: '2010-05-15'
      }
    };
  }
  
  // In production, use the real service
  return homeAffairsService.getPersonDetails(idNumber);
}