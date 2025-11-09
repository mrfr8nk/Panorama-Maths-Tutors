
import axios from 'axios';
import FormData from 'form-data';

const CATBOX_USERHASH = process.env.CATBOX_USERHASH || '61101e1ef85d3a146d5841cee';

export async function uploadToCatbox(fileBuffer: Buffer, originalFilename: string): Promise<string> {
  try {
    console.log('Uploading to Catbox:', originalFilename, 'Size:', fileBuffer.length);

    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('userhash', CATBOX_USERHASH);
    formData.append('fileToUpload', fileBuffer, {
      filename: originalFilename,
      contentType: 'application/octet-stream'
    });

    const response = await axios.post('https://catbox.moe/user/api.php', formData, {
      headers: formData.getHeaders(),
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      timeout: 300000 // 5 minutes timeout
    });

    const catboxUrl = response.data.trim();
    
    if (!catboxUrl.startsWith('http')) {
      throw new Error('Invalid response from Catbox: ' + catboxUrl);
    }

    console.log('Catbox upload successful:', catboxUrl);
    return catboxUrl;

  } catch (error: any) {
    console.error('Catbox upload error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    throw new Error(`Failed to upload file to Catbox: ${error.message}`);
  }
}
