# API Documentation

## South African ID Validation API

This document outlines the API functions available for validating South African ID numbers and extracting information from them.

## Core Validation Functions

### `validateSAID(idNumber: string)`

Validates a South African ID number according to government specifications.

**Parameters:**

- `idNumber: string` - The South African ID number to validate (should be 13 digits)

**Returns:**

```typescript
{
  isValid: boolean;            // Whether the ID number is valid
  errors: string[];            // Array of error messages if invalid
  birthDate?: Date;            // Extracted birth date (if valid)
  gender?: 'Male' | 'Female';  // Extracted gender (if valid)
  citizenshipStatus?: 'Citizen' | 'Permanent Resident'; // Extracted citizenship status (if valid)
}
```

**Example Usage:**

```typescript
import { validateSAID } from '@/utils/saIdValidation';

const result = validateSAID('9001085012088');
if (result.isValid) {
  console.log(`Birth date: ${result.birthDate}`);
  console.log(`Gender: ${result.gender}`);
  console.log(`Citizenship: ${result.citizenshipStatus}`);
} else {
  console.log('Invalid ID number:');
  result.errors.forEach(error => console.log(`- ${error}`));
}
```

### `formatSAID(idNumber: string)`

Formats a South African ID number with spaces for better readability.

**Parameters:**

- `idNumber: string` - The South African ID number to format

**Returns:**

- `string` - Formatted ID number (e.g., "990108 5012 088")

**Example Usage:**

```typescript
import { formatSAID } from '@/utils/saIdValidation';

const formattedID = formatSAID('9001085012088'); 
// Returns: "900108 5012 088"
```

## Context API

The application provides a context for managing ID validation state and operations.

### `useIdValidation()`

A custom hook that provides access to the ID validation context.

**Returns:**

```typescript
{
  idNumber: string;                  // Current ID number being validated
  setIdNumber: (value: string) => void; // Function to update ID number
  isValidating: boolean;             // Whether validation is in progress
  validationResult: {                // Local validation result
    isValid: boolean;
    errors: string[];
    birthDate?: Date;
    gender?: string;
    citizenshipStatus?: string;
  } | null;
  apiResponse: {                     // Home Affairs API response
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
  } | null;
  validateLocally: () => void;       // Perform local validation
  validateWithAPI: () => Promise<void>; // Validate with Home Affairs API
  getPersonDetails: () => Promise<void>; // Get person details from API
  resetValidation: () => void;       // Reset validation state
}
```

**Example Usage:**

```tsx
import { useIdValidation } from '@/context/idValidationContext';

function MyComponent() {
  const { 
    idNumber, 
    setIdNumber, 
    validateLocally, 
    validationResult 
  } = useIdValidation();

  const handleSubmit = (e) => {
    e.preventDefault();
    validateLocally();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={idNumber}
        onChange={(e) => setIdNumber(e.target.value)}
        placeholder="Enter ID number"
      />
      <button type="submit">Validate</button>
      
      {validationResult && (
        <div>
          {validationResult.isValid 
            ? "Valid ID number" 
            : "Invalid ID number: " + validationResult.errors.join(", ")}
        </div>
      )}
    </form>
  );
}
```

## Home Affairs Service API

The application includes a service for validating ID numbers against the South African Home Affairs department (simulated in this MVP).

### `verifyIdNumber(idNumber: string)`

Verifies an ID number against the Home Affairs database.

**Parameters:**

- `idNumber: string` - The ID number to verify

**Returns:**

- `Promise<{ status: string; message: string; }>` - Result of the verification

### `getPersonDetailsById(idNumber: string)`

Retrieves person details associated with an ID number.

**Parameters:**

- `idNumber: string` - The ID number to look up

**Returns:**

- `Promise<{ status: string; message: string; idDetails?: object; }>` - Person details

## Error Handling

All validation functions are designed to return detailed error information rather than throwing exceptions. This makes them easier to use in UI contexts where you want to display validation errors to users.

## ROI Considerations

When using these APIs, consider these ROI optimization strategies:

1. **Performance**: The validation is optimized to run quickly (under 100ms), making it suitable for real-time validation as users type.

2. **Error Messaging**: Error messages are specific and user-friendly to reduce support requirements.

3. **Offline-First**: Local validation runs independently of API calls, reducing dependency on network requests for basic validation.
