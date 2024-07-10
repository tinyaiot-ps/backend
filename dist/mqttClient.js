"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt_1 = __importDefault(require("mqtt"));
const client = mqtt_1.default.connect('mqtt://eu1.cloud.thethings.network:1883', {
    username: 'tinyaiot-project-seminar@ttn',
    password: process.env.MQTT_CLIENT_KEY,
});
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    for (let i = 1; i <= 10; i++) {
        const topic = `v3/tinyaiot-project-seminar@ttn/devices/trash-bin-0${i}/up`;
        client.subscribe(topic, () => {
            console.log(`Subscribed to topic '${topic}'`);
        });
    }
});
client.on('message', (topic, message) => {
    console.log('EVENT RECIEVED with TOPIC', topic);
    console.log('Received message:', message.toString());
    // Lets assume the message is
    const finalMessage = '';
});
client.on('error', (error) => {
    console.error('MQTT connection error:', error);
});
exports.default = client;
