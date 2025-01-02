import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import http from 'http';
import { Server } from 'socket.io';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.emit('message', 'Welcome to EchoChat!');

  socket.broadcast.emit('message', 'A user has joined the chat.');
  
  socket.on ('disconnect', () => {
    io.emit('message', 'A user has left the chat.');
  });

  socket.on('chatMessage', (msg) => {
    io.emit('message', msg);
  });
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});