//working:
import axios from 'axios';

// URL der OpenSenseMap API
const API_URL = 'https://api.opensensemap.org/boxes/';
const SENSOR_ID = '65f9865dad2eb20007aad333'; 

async function fetchSensorData(sensorId: string): Promise<void> {
  try {
    const response = await axios.get(`${API_URL}${sensorId}`);
    const data = response.data;

    console.log('Sensor data:', data);
  } catch (error) {
    console.error('Fehler beim Abrufen der Sensordaten:', error);
  }
}

fetchSensorData(SENSOR_ID);