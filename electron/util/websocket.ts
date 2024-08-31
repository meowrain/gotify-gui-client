const WebSocket = require('ws');
let ws = null;

const connectWebSocket = (event, url) => {
  if (ws) {
    ws.close();
  }

  ws = new WebSocket(url);

  ws.on('message', (data) => {
    event.sender.send('websocket-message', data.toString());
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    event.sender.send('websocket-error', error.message);
  });

  ws.on('close', (code, reason) => {
    console.log('WebSocket connection closed:', code, reason);
    event.sender.send('websocket-close', { code, reason });
  });
};

const disconnectWebSocket = () => {
  if (ws) {
    ws.close();
    ws = null;
  }
};

module.exports = { connectWebSocket, disconnectWebSocket };
