//working:
import { MongoClient } from 'mongodb';

const MONGO_URI = 'mongodb+srv://nilsloeken:eLFSfF1gKGl7WVOa@tinyaiot.hwv61ob.mongodb.net/'; 

async function createTimeseriesCollection() {
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('OpenSenseMapData');

    await db.createCollection("OSMTimeSeries", {
      timeseries: {
        timeField: "createdAt",
        metaField: "metadata", 
        granularity: "seconds" 
      }
    });

    console.log('Timeseries collection created');
  } finally {
    await client.close();
  }
}

createTimeseriesCollection().catch(console.dir);
