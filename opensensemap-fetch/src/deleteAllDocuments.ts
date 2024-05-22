//working:
const { MongoClient } = require('mongodb');
const MONGO_URI = 'mongodb+srv://nilsloeken:eLFSfF1gKGl7WVOa@tinyaiot.hwv61ob.mongodb.net/'; 
const DATABASE_NAME = 'OpenSenseMapData';
const COLLECTION_NAME = 'OSMTimeSeries';

async function deleteAllDocuments() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db(DATABASE_NAME);
    const collection = database.collection(COLLECTION_NAME);

    const deleteResult = await collection.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} documents from ${COLLECTION_NAME}`);

  } catch (error) {
    console.error('Error deleting documents:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

deleteAllDocuments();
