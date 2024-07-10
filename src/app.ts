import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
const dotenv = require('dotenv');

import authRouter from './routes/auth';
import cityRouter from './routes/city';
import projectRouter from './routes/project';
import trashbinRouter from './routes/trashbin';
import sensorRouter from './routes/sensor';
import trashCollectorRouter from './routes/trashCollector';
import noiseRouter from './routes/noise';

const mqtt = require('mqtt');

const app = express();
const PORT = process.env.PORT || 5001;

dotenv.config();

// import './mqttClient';
// Middleware
app.use(bodyParser.json());

const corsOptions = {
  origin: [
    'https://beamish-cendol-b3537c.netlify.app',
    'http://localhost:3000',
    'http://localhost:3001',
  ],
  credentials: true,
};

app.use((req: any, res: any, next: any) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(cors(corsOptions));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/city', cityRouter);
app.use('/api/v1/project', projectRouter);
app.use('/api/v1/trashbin', trashbinRouter);
app.use('/api/v1/sensor', sensorRouter);
app.use('/api/v1/trash-collector', trashCollectorRouter);
app.use('/api/v1/noise', noiseRouter);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_DB_URL || '', {})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Define a route
app.get('/', (req, res) => {
  res.send('Hello World with from TinyAIoT');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
