const express = require('express');
const app = express();
const port = 3000;
const server = require('http').createServer(app);
const WebSocket = require('ws');
const axios = require('axios'); 

const wss = new WebSocket.Server({ server: server });

wss.on('connection', function connection(ws) {
  console.log('A new client connected');
  ws.send('Welcome new client');

  ws.on('message', function incoming(message) {
    console.log('Received %s', message);

    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`-` + message);
      }
    });
  });

  fetchDataAndSendToClient(ws);
});

async function fetchDataAndSendToClient(ws) {
  try {
    const response = await axios.get('https://api.dpoweri.co.id/operations');
    const apiData = response.data;

    ws.send(JSON.stringify(apiData));
  } catch (error) {
    console.error('Error fetching data from API:', error.message);
  }
}

app.get('/', (req, res) => {
  res.send('');
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
