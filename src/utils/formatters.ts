export const formatCurrency = (amount: number | null | string) => {
  if (amount === null || amount === undefined) return 'N/A';
  
  try {
    // Convert string to number if needed
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    // Check for valid number
    if (isNaN(numericAmount) || !isFinite(numericAmount)) {
      return 'Invalid Amount';
    }

    // Format the currency
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(numericAmount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return 'Error formatting amount';
  }
}; 