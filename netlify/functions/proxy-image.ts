import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { imageUrl } = JSON.parse(event.body || '{}');
    if (!imageUrl) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Image URL is required' })
      };
    }

    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Get the image data and content type
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';

    // Return the image data as base64
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: Buffer.from(buffer).toString('base64'),
        contentType
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error'
      })
    };
  }
};