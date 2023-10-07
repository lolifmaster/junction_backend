const express = require('express');
const helmet = require("helmet");
const http = require('http');
const ip = require('ip');
const ipAddress = ip.address();
const mqtt = require('mqtt');
const { Server } = require("socket.io");
require('dotenv').config()

const app = express();
app.use(helmet());
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: '*',
        methods: ['GET']
    }
});

const mqttBrokerUrl = process.env.MQTT_URL;
const mqttTopic = '#';
const uavIds = []



const mqttClient = mqtt.connect(mqttBrokerUrl);

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe(mqttTopic);
});

mqttClient.on('message', (topic, message) => {
    const data = message.toString();
    const uavId = topic.split('/')[0]
    if(!uavId.startsWith('uav')) return
    if(!uavIds.includes(uavId)){
        uavIds.push(uavId)
        console.log(uavId)
        io.emit('newUva', uavId)
    }

    const topicMappings = {
        [`${uavId}/state`]: 'state',
        [`${uavId}/armed`]: 'armed',
        [`${uavId}/in_air`]: 'in_air',
        [`${uavId}/gps/lat`]: 'lat',
        [`${uavId}/gps/lon`]: 'lon',
        [`${uavId}/gps/fx`]: 'fx',
        [`${uavId}/gps/ns`]: 'ns',
        [`${uavId}/gps/abs`]: 'abs',
        [`${uavId}/bat/id`]: 'batId',
        [`${uavId}/bat/vl`]: 'batVl',
        [`${uavId}/bat/pt`]: 'batPt',
    };
    const socketEvent = topicMappings[topic] || topic;
    io.emit(uavId, { topic: socketEvent, data, uavId });

});


const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
    console.log(`Network access via: ${ipAddress}:${port}!`);
});

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.emit('hello', uavIds);

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});
