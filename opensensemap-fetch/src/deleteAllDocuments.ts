const { MongoClient } = require('mongodb');
const MONGO_URI = 'mongodb+srv://nilsloeken:eLFSfF1gKGl7WVOa@tinyaiot.hwv61ob.mongodb.net/'; 

// Name der Datenbank und Sammlung
const DATABASE_NAME = 'OpenSenseMapData';
const COLLECTION_NAME = 'OpenSenseMapData';

async function deleteAllDocuments() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const database = client.db(DATABASE_NAME);
    const collection = database.collection(COLLECTION_NAME);

    // Lösche alle Dokumente aus der Sammlung
    const deleteResult = await collection.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} documents from ${COLLECTION_NAME}`);

  } catch (error) {
    console.error('Error deleting documents:', error);
  } finally {
    // Schließe die Verbindung zur MongoDB
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Aufrufen der Funktion zum Löschen aller Dokumente
deleteAllDocuments();
