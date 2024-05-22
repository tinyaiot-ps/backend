//working:
import axios from 'axios';

const API_URL = 'https://api.opensensemap.org/boxes';
const SENSEBOX_ID = '65f9865dad2eb20007aad333'; 
const SENSOR_ID = '65f9865dad2eb20007aad334';  

// optional (ISO 8601-Format):
const FROM_DATE = '2023-09-01T00:00:00Z'; 
const TO_DATE = '2024-05-21T23:59:59Z'; 

async function fetchSensorMeasurements(senseBoxId: string, sensorId: string, fromDate?: string, toDate?: string): Promise<void> {
  try {
    const url = `${API_URL}/${senseBoxId}/data/${sensorId}?download=true&format=json${fromDate ? `&from-date=${fromDate}` : ''}${toDate ? `&to-date=${toDate}` : ''}`;
    
    const response = await axios.get(url);
    const measurements = response.data;

    console.log('Sensor Measurements:', measurements);
  } catch (error) {
    console.error('Error fetching sensor measurements:', error);
  }
}

fetchSensorMeasurements(SENSEBOX_ID, SENSOR_ID, FROM_DATE, TO_DATE);