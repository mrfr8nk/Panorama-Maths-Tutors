import axios from 'axios';
import FormData from 'form-data';

interface UploadResult {
  success: boolean;
  cdnUrl?: string;
  fileId?: string;
  error?: string;
}

export async function uploadToCatbox(
  fileBuffer: Buffer,
  filename: string,
  mimeType: string
): Promise<UploadResult> {
  try {
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', fileBuffer, {
      filename: filename,
      contentType: mimeType
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

    const fileId = catboxUrl.split('/').pop() || '';
    
    return {
      success: true,
      cdnUrl: catboxUrl,
      fileId: fileId
    };
  } catch (error: any) {
    console.error('Catbox upload error:', error);
    return {
      success: false,
      error: error.message || 'Upload failed'
    };
  }
}
