const axios = require('axios');

module.exports = async (req, res) => {
  try {
    // Manually parse body if not auto-parsed
    let body = req.body;
    if (!body) {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      try {
        body = JSON.parse(Buffer.concat(buffers).toString());
      } catch {
        return res.status(400).json({ error: 'Invalid JSON in request body' });
      }
    }

    const { prompt, apiKey } = body;

    if (!prompt || !apiKey) {
      return res.status(400).json({ error: 'Prompt and API key are required' });
    }

    // Call OpenAI API
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful assistant that assists with employee selection based on relevance.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 1000
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          }
        }
      );

      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        return res.status(502).json({ error: 'No content in OpenAI response' });
      }

      // Parse the OpenAI response
      let result = [];
      try {
        // Try to parse the content directly
        result = JSON.parse(content);
      } catch (parseError) {
        // If direct parsing fails, try to extract the JSON array from the text
        console.error('Error parsing OpenAI response directly:', parseError);
        
        const match = content.match(/\[.*?\]/s);
        if (match) {
          try {
            result = JSON.parse(match[0]);
          } catch (innerError) {
            console.error('Error extracting JSON from response:', innerError);
            return res.status(502).json({ error: 'Failed to parse OpenAI response' });
          }
        } else {
          return res.status(502).json({ error: 'No JSON array found in OpenAI response' });
        }
      }

      return res.status(200).json({ result });
    } catch (axiosError) {
      console.error('OpenAI API error:', axiosError.response?.data || axiosError.message);
      return res.status(axiosError.response?.status || 500).json({
        error: 'OpenAI API error',
        details: axiosError.response?.data || axiosError.message
      });
    }
  } catch (error) {
    console.error('Proxy function error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'An unexpected error occurred'
    });
  }
}; 