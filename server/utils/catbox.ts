import axios from 'axios';
import FormData from 'form-data';

export async function uploadToCatbox(file: Buffer, filename: string): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', file, filename);

    const response = await axios.post('https://catbox.moe/user/api.php', formData, {
      headers: formData.getHeaders()
    });

    return response.data;
  } catch (error) {
    console.error('Catbox upload error:', error);
    throw new Error('Failed to upload file to Catbox');
  }
}
