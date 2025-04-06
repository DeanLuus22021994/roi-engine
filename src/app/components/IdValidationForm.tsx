'use client';

import React, { useState } from 'react';
import { useIdValidation } from '../context/idValidationContext';
import { formatSAID } from '../utils/saIdValidation';

const IdValidationForm: React.FC = () => {
  const {
    idNumber,
    setIdNumber,
    isValidating,
    validationResult,
    apiResponse,
    validateLocally,
    validateWithAPI,
    getPersonDetails,
    resetValidation
  } = useIdValidation();

  const [showDetails, setShowDetails] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-numeric characters
    const numericValue = e.target.value.replace(/\D/g, '');
    setIdNumber(numericValue);
    
    // Reset validation when input changes
    if (validationResult || apiResponse) {
      resetValidation();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateLocally();
  };

  const handleApiValidation = () => {
    validateWithAPI();
  };

  const handleGetDetails = () => {
    getPersonDetails();
    setShowDetails(true);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">South African ID Validation</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">
            ID Number
          </label>
          <input
            id="idNumber"
            type="text"
            value={idNumber}
            onChange={handleInputChange}
            placeholder="Enter 13-digit ID number"
            maxLength={13}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {idNumber.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Formatted: {formatSAID(idNumber)}
            </p>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Validate Locally
          </button>
          <button
            type="button"
            onClick={handleApiValidation}
            disabled={isValidating || !idNumber || idNumber.length !== 13}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400"
          >
            Verify with Home Affairs
          </button>
          <button
            type="button"
            onClick={handleGetDetails}
            disabled={isValidating || !idNumber || idNumber.length !== 13}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-400"
          >
            Get Person Details
          </button>
        </div>
      </form>
      
      {isValidating && (
        <div className="text-center py-3">
          <p>Validating...</p>
          {/* You could add a loading spinner here */}
        </div>
      )}
      
      {validationResult && (
        <div className={`p-4 rounded-md mb-4 ${validationResult.isValid ? 'bg-green-100' : 'bg-red-100'}`}>
          <h3 className="text-lg font-semibold mb-2">
            Local Validation: {validationResult.isValid ? 'Valid' : 'Invalid'}
          </h3>
          
          {!validationResult.isValid && validationResult.errors.length > 0 && (
            <ul className="list-disc list-inside text-red-700">
              {validationResult.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
          
          {validationResult.isValid && (
            <div className="mt-2">
              <p><strong>Birth Date:</strong> {validationResult.birthDate?.toLocaleDateString()}</p>
              <p><strong>Gender:</strong> {validationResult.gender}</p>
              <p><strong>Citizenship:</strong> {validationResult.citizenshipStatus}</p>
            </div>
          )}
        </div>
      )}
      
      {apiResponse && (
        <div className={`p-4 rounded-md mb-4 ${apiResponse.status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
          <h3 className="text-lg font-semibold mb-2">
            API Validation: {apiResponse.status === 'success' ? 'Valid' : 'Invalid'}
          </h3>
          
          {apiResponse.message && (
            <p className={apiResponse.status === 'error' ? 'text-red-700' : 'text-green-700'}>
              {apiResponse.message}
            </p>
          )}
          
          {apiResponse.idDetails && showDetails && (
            <div className="mt-3 p-3 bg-white rounded border">
              <h4 className="font-medium mb-2">Person Details</h4>
              <p><strong>Name:</strong> {apiResponse.idDetails.name} {apiResponse.idDetails.surname}</p>
              <p><strong>Birth Date:</strong> {apiResponse.idDetails.birthDate}</p>
              <p><strong>Gender:</strong> {apiResponse.idDetails.gender}</p>
              <p><strong>Citizenship:</strong> {apiResponse.idDetails.citizenshipStatus}</p>
              {apiResponse.idDetails.isDeceased !== undefined && (
                <p><strong>Status:</strong> {apiResponse.idDetails.isDeceased ? 'Deceased' : 'Living'}</p>
              )}
              {apiResponse.idDetails.issuedDate && (
                <p><strong>ID Issued:</strong> {apiResponse.idDetails.issuedDate}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IdValidationForm;