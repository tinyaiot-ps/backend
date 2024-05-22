//not finished:
import axios from 'axios';
import { MongoClient, Db, Collection } from 'mongodb';

const MONGO_URI = 'mongodb+srv://nilsloeken:eLFSfF1gKGl7WVOa@tinyaiot.hwv61ob.mongodb.net/';
const API_URL = 'https://api.opensensemap.org/boxes';
const SENSEBOX_ID = '65f9865dad2eb20007aad333'; 
const SENSOR_ID = '65f9865dad2eb20007aad334';   
const FROM_DATE = '2022-09-01T00:00:00Z'; 
const TO_DATE = '2024-05-21T23:59:59Z';  

async function connectToMongoDB(uri: string): Promise<{ db: Db, client: MongoClient }> {
  const client = new MongoClient(uri);
  await client.connect();
  console.log('Verbunden mit MongoDB');
  const db = client.db('OpenSenseMapData'); 
  return { db, client };
}
  
async function fetchAndStoreSensorMeasurements(
  senseBoxId: string,
  sensorId: string,
  fromDate?: string,
  toDate?: string
): Promise<void> {
  try {
    const url = `${API_URL}/${senseBoxId}/data/${sensorId}?download=true&format=json${fromDate ? `&from-date=${fromDate}` : ''}${toDate ? `&to-date=${toDate}` : ''}`;
    const response = await axios.get(url);
    const measurements = response.data;
  
    const { db, client } = await connectToMongoDB(MONGO_URI);
    const collection: Collection = db.collection('OSMTimeSeries'); 
  
    const insertDocuments = measurements.map((measurement: any) => ({
      metadata: { 
        sensorId: sensorId, 
        type: measurement.sensorType,
        location: { 
          type: 'Point',
          coordinates: [measurement.location.longitude, measurement.location.latitude]
        }
      },
      timestamp: new Date(measurement.createdAt),
      value: measurement.value,
    }));
    const insertResult = await collection.insertMany(insertDocuments);
    console.log(`Eingefügt: ${insertResult.insertedCount} Messungen in MongoDB`);
  
    await client.close();
  } catch (error) {
    console.error('Fehler beim Abrufen oder Speichern von Sensor-Messwerten:', error);
  }
}
  
fetchAndStoreSensorMeasurements(SENSEBOX_ID, SENSOR_ID, FROM_DATE, TO_DATE);
