import { Employee } from '@/types';
import { getOpenAIKey } from '@/utils/apiKeys';

export const selectRelevantEmployees = async (employees: Employee[], query: string): Promise<Employee[]> => {
  if (!employees || employees.length === 0) {
    console.log('No employees to process');
    return [];
  }

  try {
    // Prepare employee data to send to OpenAI
    const employeeData = employees.map(emp => ({
      id: emp.id,
      name: emp.name,
      title: emp.title,
      department: emp.department,
      location: emp.location
    }));

    // Create the prompt for OpenAI
    const prompt = `
      You are an AI assistant helping to identify the most relevant employees for a specific query.
      
      QUERY: "${query}"
      
      Below is a list of employees with their titles, departments, and locations:
      ${JSON.stringify(employeeData, null, 2)}
      
      Based on the query, select the employee IDs that are most relevant. 
      Consider the following factors:
      1. Job title relevance to the query
      2. Department relevance
      3. Seniority level when applicable
      4. Select a diverse range of employees that would be most valuable for the query

      Return ONLY a JSON array of employee IDs without any additional text or explanation.
      Example response format: ["id1", "id2", "id3"]
      
      Select at most 10 employees. If there are fewer relevant matches, select fewer.
    `;

    // Use the existing proxy pattern to make the OpenAI API call
    const response = await fetch('/api/openai-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        apiKey: getOpenAIKey()
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get OpenAI response');
    }

    const data = await response.json();
    const selectedIds = data.result || [];
    
    console.log('Selected employee IDs:', selectedIds);

    // Return the updated employee list with selected employees marked
    return employees.map(emp => ({
      ...emp,
      selected: selectedIds.includes(emp.id)
    }));
  } catch (error) {
    console.error('Error in OpenAI employee selection:', error);
    // Fall back to random selection in case of an error
    const shuffled = [...employees].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10).map(emp => ({ ...emp, selected: true }));
  }
}; 