
import axios from 'axios';

export async function uploadDocument(file: File): Promise<void> {
  const data = new FormData();
  data.append('file', file);

  await axios.post('http://localhost:8080/docsearch/api/files/upload', data);
}
