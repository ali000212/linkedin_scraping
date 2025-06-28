// This file manages API keys in a more maintainable way

// OpenAI API key
export const OPENAI_API_KEY = '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';

// Function to get the OpenAI API key
export const getOpenAIKey = (): string => {
  // In a production environment, you might want to:
  // 1. Use environment variables
  // 2. Fetch from a secure backend
  // 3. Use a key management service
  
  // For this implementation, we're returning the hardcoded key
  return OPENAI_API_KEY;
};

// Apollo API key (for reference)
// export const APOLLO_API_KEY = 'ij9yz7z_fyF1JKN0tagvRw'; 
// export const APOLLO_API_KEY = 'xBV7rxTZLqWd7N4dXm0INQ';
export const APOLLO_API_KEY = 'xBV7rxTZLqWd7N4dXm0INQ';