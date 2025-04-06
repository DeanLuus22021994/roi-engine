'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { validateSAID } from '@/utils/saIdValidation';
import { verifyIdNumber, getPersonDetailsById } from '@/utils/homeAffairsService';
import { useContextAwarenessContext } from './contextAwarenessContext';

type ValidationResult = ReturnType<typeof validateSAID> | null;

interface ApiResponse {
  status: 'success' | 'error';
  message: string;
  idDetails?: {
    name: string;
    surname: string;
    birthDate: string;
    gender: string;
    citizenshipStatus: string;
    isDeceased?: boolean;
    issuedDate?: string;
  };
}

interface IdValidationContextType {
  idNumber: string;
  setIdNumber: (value: string) => void;
  isValidating: boolean;
  validationResult: ValidationResult;
  apiResponse: ApiResponse | null;
  validateLocally: () => void;
  validateWithAPI: () => Promise<void>;
  getPersonDetails: () => Promise<void>;
  resetValidation: () => void;
}

const IdValidationContext = createContext<IdValidationContextType | undefined>(undefined);

export function IdValidationProvider({ children }: { children: ReactNode }) {
  const [idNumber, setIdNumber] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult>(null);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  
  const { trackFeatureUsage, measurePerformance } = useContextAwarenessContext();

  const validateLocally = () => {
    trackFeatureUsage('localValidation');
    
    const startTime = performance.now();
    const result = validateSAID(idNumber);
    const endTime = performance.now();
    
    measurePerformance('idValidation', endTime - startTime);
    setValidationResult(result);
    
    return result;
  };

  const validateWithAPI = async () => {
    try {
      setIsValidating(true);
      trackFeatureUsage('apiValidation');
      
      const startTime = performance.now();
      const response = await verifyIdNumber(idNumber);
      const endTime = performance.now();
      
      measurePerformance('apiValidation', endTime - startTime);
      setApiResponse(response);
      
      return response;
    } catch (error) {
      setApiResponse({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const getPersonDetails = async () => {
    try {
      setIsValidating(true);
      trackFeatureUsage('getPersonDetails');
      
      const startTime = performance.now();
      const response = await getPersonDetailsById(idNumber);
      const endTime = performance.now();
      
      measurePerformance('getPersonDetails', endTime - startTime);
      setApiResponse(response);
      
      return response;
    } catch (error) {
      setApiResponse({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const resetValidation = () => {
    setValidationResult(null);
    setApiResponse(null);
  };

  return (
    <IdValidationContext.Provider
      value={{
        idNumber,
        setIdNumber,
        isValidating,
        validationResult,
        apiResponse,
        validateLocally,
        validateWithAPI,
        getPersonDetails,
        resetValidation
      }}
    >
      {children}
    </IdValidationContext.Provider>
  );
}

export function useIdValidation() {
  const context = useContext(IdValidationContext);
  if (context === undefined) {
    throw new Error('useIdValidation must be used within an IdValidationProvider');
  }
  return context;
}