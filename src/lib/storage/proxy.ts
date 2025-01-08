export async function fetchImageViaProxy(imageUrl: string): Promise<Blob> {
  const response = await fetch('/.netlify/functions/proxy-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageUrl })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch image via proxy');
  }

  const { data, contentType } = await response.json();
  const binaryData = atob(data);
  const bytes = new Uint8Array(binaryData.length);
  for (let i = 0; i < binaryData.length; i++) {
    bytes[i] = binaryData.charCodeAt(i);
  }
  
  return new Blob([bytes], { type: contentType });
}