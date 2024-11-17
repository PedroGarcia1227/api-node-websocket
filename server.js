const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const wssCapture = new WebSocket.Server({ noServer: true });
const wssStream = new WebSocket.Server({ noServer: true });

app.use(express.static('public'));

const rooms = {};

app.get('/connect', (req, res) => {
    res.sendFile(__dirname + '/public/connect.html');
});

app.get('/watch', (req, res) => {
    res.sendFile(__dirname + '/public/watch.html');
});

wssCapture.on('connection', (ws, req) => {
    const { roomName } = req;
    
    if (!rooms[roomName]) {
        rooms[roomName] = { capturers: [], viewers: [] };
    }

    const capturerId = `camera-${Date.now()}`;
    rooms[roomName].capturers.push({ ws, id: capturerId });

    ws.on('message', (message) => {
        const frameData = JSON.stringify({ id: capturerId });
    
        rooms[roomName].viewers.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(frameData);
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        rooms[roomName].capturers = rooms[roomName].capturers.filter(c => c.ws !== ws);

        // Enviar mensagem de encerramento de transmissão para espectadores
        if (rooms[roomName].capturers.length === 0) {
            rooms[roomName].viewers.forEach(viewer => {
                if (viewer.readyState === WebSocket.OPEN) {
                    viewer.send(JSON.stringify({ type: 'stream-ended' }));
                }
                viewer.close(); // Fechar a conexão do espectador
            });
            delete rooms[roomName]; // Remover a sala do objeto rooms
        }
    });
});

wssStream.on('connection', (ws, req) => {
    const { roomName } = req;

    if (!rooms[roomName]) {
        rooms[roomName] = { capturers: [], viewers: [] };
    }

    rooms[roomName].viewers.push(ws);

    ws.on('close', () => {
        // Verifica se a sala ainda existe antes de modificar viewers
        if (rooms[roomName]) {
            rooms[roomName].viewers = rooms[roomName].viewers.filter(v => v !== ws);
        }
    });
});

server.on('upgrade', (req, socket, head) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const roomName = url.searchParams.get('room');

    if (url.pathname === '/capture') {
        req.roomName = roomName;
        wssCapture.handleUpgrade(req, socket, head, (ws) => {
            wssCapture.emit('connection', ws, req);
        });
    } else if (url.pathname === '/live-stream') {
        req.roomName = roomName;
        wssStream.handleUpgrade(req, socket, head, (ws) => {
            wssStream.emit('connection', ws, req);
        });
    } else {
        socket.destroy();
    }
});

server.listen(3000, () => {
    console.log('API Node.js rodando na porta 3000');
});
