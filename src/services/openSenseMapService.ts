import axios from 'axios';

export const fetchData = async (): Promise<any> => {
  try {
    const response = await axios.get('https://api.opensensemap.org/...');
    return response.data;
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
    throw new Error('Fehler beim Abrufen der Daten');
  }
};