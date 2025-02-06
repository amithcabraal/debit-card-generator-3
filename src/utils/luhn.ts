// Luhn algorithm implementation
export function generateLuhnNumber(partial: string): string {
  // Calculate sum without the check digit
  let sum = 0;
  let isEven = true; // Starting from right-to-left, first position will be odd
  
  // Calculate Luhn sum for the partial number
  for (let i = partial.length - 1; i >= 0; i--) {
    let digit = parseInt(partial[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  // Calculate check digit (what number needs to be added to make sum divisible by 10)
  const checkDigit = (10 - (sum % 10)) % 10;
  return partial + checkDigit;
}

export function generateCardNumber(prefix: string): string {
  const length = 16; // Standard debit card length
  let partial = prefix;
  
  // Generate random digits until we're one short of the desired length
  while (partial.length < length - 1) {
    partial += Math.floor(Math.random() * 10);
  }
  
  return generateLuhnNumber(partial);
}

export function validateLuhn(number: string): boolean {
  let sum = 0;
  let isEven = true; // Starting from right-to-left, first position will be odd
  
  // Calculate sum including check digit
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}