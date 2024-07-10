import mqtt from 'mqtt';
import { mqttTrashParser } from './utils/mqtt';
import { History } from './models/history';

const client = mqtt.connect('mqtt://eu1.cloud.thethings.network:1883', {
  username: 'tinyaiot-project-seminar@ttn',
  password: process.env.MQTT_CLIENT_KEY,
});

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  const topic = `v3/tinyaiot-project-seminar@ttn/devices/trash-bin-01/up`;
  client.subscribe(topic, () => {
    console.log(`Subscribed to topic '${topic}'`);
  });
});

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  const topic = `v3/tinyaiot-project-seminar@ttn/devices/trash-bin-02/up`;
  client.subscribe(topic, () => {
    console.log(`Subscribed to topic '${topic}'`);
  });
});

client.on('message', async (topic: any, message: any) => {
  console.log('EVENT RECIEVED with TOPIC', topic);
  console.log('Received message:', message.toString());

  const { batteryLevel, fillLevel, signalLevel } = mqttTrashParser(
    JSON.parse(message)
  );

  if (topic === 'v3/tinyaiot-project-seminar@ttn/devices/trash-bin-01/up') {
    console.log('Receive payload in topic 01');
    if (batteryLevel) {
      const newHistory = new History({
        sensor: '668ea283ce9d2654830be4f9',
        measureType: 'battery_level',
        measurement: batteryLevel ? batteryLevel * 100 : 0,
      });
      const response = await newHistory.save();
      console.log('In Topic 01 with adding battery level =>', response);
    }

    if (fillLevel) {
      const newHistory = new History({
        sensor: '668ea252ce9d2654830be4f3',
        measureType: 'fill_level',
        measurement: fillLevel ? fillLevel * 100 : 0,
      });
      const response = await newHistory.save();
      console.log('In Topic 01 with adding fill level =>', response);
    }
  } else if (
    topic === 'v3/tinyaiot-project-seminar@ttn/devices/trash-bin-02/up'
  ) {
    console.log('Receive payload in topic 02');

    if (batteryLevel) {
      const newHistory = new History({
        sensor: '668ea2bbce9d2654830be505',
        measureType: 'battery_level',
        measurement: batteryLevel ? batteryLevel * 100 : 0,
      });
      const response = await newHistory.save();
      console.log('In Topic 02 with adding battery level =>', response);
    }

    if (fillLevel) {
      const newHistory = new History({
        sensor: '668ea29dce9d2654830be4ff',
        measureType: 'fill_level',
        measurement: fillLevel ? fillLevel * 100 : 0,
      });
      const response = await newHistory.save();
      console.log('In Topic 02 with adding fill level =>', response);
    }
  }
});

client.on('error', (error: any) => {
  console.error('MQTT connection error:', error);
});

export default client;
