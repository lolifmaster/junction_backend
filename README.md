# Node.js Server with MQTT and WebSocket Integration

This Node.js server is designed to connect to an MQTT broker and provide real-time updates to clients through WebSocket. It is particularly useful for monitoring and controlling UAVs (Unmanned Aerial Vehicles).

## Features

- MQTT integration to subscribe to relevant topics.
- WebSocket communication to send real-time updates to clients.
- Basic security with Helmet middleware.
- CORS configuration for easy client access.
- Environment variable support using dotenv.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your system.
- An MQTT broker accessible with the MQTT broker URL set in the `.env` file.
- Configure your MQTT topics according to your UAV setup.
