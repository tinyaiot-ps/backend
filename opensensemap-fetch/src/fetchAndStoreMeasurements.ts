//working:
import axios from 'axios';
import { MongoClient, Db, Collection } from 'mongodb';

// Connection parameters (to be relocated)
const MONGO_URI = 'mongodb+srv://nilsloeken:eLFSfF1gKGl7WVOa@tinyaiot.hwv61ob.mongodb.net/'; 
const API_URL = 'https://api.opensensemap.org/boxes';
const SENSEBOX_ID = '65f9865dad2eb20007aad333'; 
const SENSOR_ID = '65f9865dad2eb20007aad334';   

// Optional: dates for measurement timespan (in ISO 8601-format)
const FROM_DATE = '2022-09-01T00:00:00Z'; 
const TO_DATE = '2024-05-21T23:59:59Z';  

// Function to connect to specific MongoDB database
async function connectToMongoDB(uri: string): Promise<{ db: Db, client: MongoClient }> {
  const client = new MongoClient(uri);
  await client.connect();
  console.log('Connected to MongoDB');
  const db = client.db('OpenSenseMapData'); 
  return { db, client };
}
  
// Function to fetch measurements from OpenSenseMap API and store in db
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
  
    // Connect to db and specific collection
    const { db, client } = await connectToMongoDB(MONGO_URI);
    const collection: Collection = db.collection('OpenSenseMapData'); 
  
    // Insert measurement data in collection
    const insertResult = await collection.insertMany(measurements);
    console.log(`Inserted ${insertResult.insertedCount} measurements into MongoDB`);
  
    // Close connection to db
    await client.close();
  } catch (error) {
    console.error('Error fetching or storing sensor measurements:', error);
  }
}
  
fetchAndStoreSensorMeasurements(SENSEBOX_ID, SENSOR_ID, FROM_DATE, TO_DATE);