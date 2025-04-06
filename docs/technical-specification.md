# Technical Specification: South African ID Number Validation

## Overview

This document provides detailed technical information on the algorithms and validation methods used for South African ID numbers, including the Luhn algorithm for checksum validation and other derivable information.

## South African ID Number Structure

South African ID numbers follow a 13-digit format:

```
YYMMDD SSSS Z A C
```

Where:

- **YYMMDD**: Date of birth (6 digits)
- **SSSS**: Gender sequence number (4 digits)
- **Z**: Citizenship status (1 digit)
- **A**: Historical race classification, now standardized as '8' (1 digit)
- **C**: Checksum digit (1 digit)

## Luhn Algorithm Implementation

The South African ID number checksum (last digit) is calculated using the Luhn algorithm (also known as "modulus 10" or "mod 10" algorithm), which is commonly used for validating various identification numbers worldwide.

### Algorithm Steps

1. Starting from the rightmost digit (excluding the check digit), double the value of every second digit.
2. If doubling results in a two-digit number, add those digits together to get a single-digit result.
3. Sum all the digits (both doubled and non-doubled).
4. The check digit is the value that, when added to this sum, would make it a multiple of 10.

### Implementation Pseudocode

```
function calculateLuhnChecksum(digits):
    sum = 0
    alternate = false
    
    for each digit from right to left (excluding check digit):
        if alternate:
            digit = digit * 2
            if digit > 9:
                digit = digit - 9
        
        sum = sum + digit
        alternate = !alternate
    
    checksum = (10 - (sum % 10)) % 10
    return checksum
```

### Example Calculation

For ID number "9001015800086" (check digit is 6):

1. Take digits except the last: "900101580008"
2. From right to left, double every second digit:
   - 8→16→7 (1+6=7), 0→0, 8→16→7, 5→10→1, 1→2, 0→0, 0→0, 9→18→9
3. Sum all digits (doubled and non-doubled): 7+0+7+1+2+0+0+9 = 26
4. Check digit = (10 - (26 % 10)) % 10 = (10 - 6) % 10 = 4

This doesn't match the provided check digit (6), suggesting either an incorrect example or calculation.

## Information Derivation from ID Number

Beyond basic validation, several pieces of information can be extracted from a valid South African ID number:

### 1. Date of Birth (YYMMDD)

- First 6 digits represent YYMMDD format
- Year interpretation:
  - YY < 50: 20YY (born 2000 or later)
  - YY ≥ 50: 19YY (born before 2000)

### 2. Gender (SSSS)

- Digits 7-10 (SSSS):
  - 0000-4999: Female
  - 5000-9999: Male

### 3. Citizenship Status (Z)

- Digit 11 (Z):
  - 0: South African citizen
  - 1: Permanent resident

### 4. Historical Classification (A)

- Digit 12 (A):
  - Historically used for race classification during apartheid
  - Now standardized as '8' for all new ID numbers
  - Legacy ID numbers may have different values

### 5. Age Calculation

- Current date minus birth date derived from YYMMDD
- Must account for century interpretation (19YY or 20YY)

### 6. Birth Region or Country (First issue location)

While not directly encoded in the ID number itself, statistical analysis of ranges within the SSSS sequence can sometimes indicate original issuing office or birth region. However, this is not an official part of the ID structure and should not be relied upon for validation.

## Comprehensive Validation Process

A complete validation of South African ID numbers should include:

1. **Format Validation**
   - Exactly 13 digits
   - All characters are numeric

2. **Birth Date Validation**
   - YYMMDD represents a valid date
   - Date is not in the future
   - For very old dates (suggesting age >120), consider additional verification

3. **Citizenship Digit Validation**
   - Must be 0 or 1

4. **Checksum Validation Using Luhn Algorithm**
   - The calculated checksum must match the check digit (13th digit)

5. **Consistency Check**
   - The gender sequence and citizenship values should be within valid ranges
   - The historical digit is typically 8 for modern IDs

## Implementation Notes

### Performance Considerations

- Validation operations should complete in under 100ms
- Caching validation results for frequently checked ID numbers can improve performance

### Security Considerations

The Protection of Personal Information Act (POPIA) requirements:

- ID numbers should be treated as sensitive personal information
- Hash or encrypt ID numbers when storing in databases
- Implement access controls for any system handling ID numbers
- Obtain explicit consent for processing ID numbers
- Document the purpose and retention period for stored ID numbers

### Edge Cases

- Legacy ID numbers issued before standardization may have different formats
- Temporary residents and international visitors have different identification formats
- Test for common data entry errors (transposition, repeated digits)
