import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import http from 'http';
import { Server } from 'socket.io';
import { formatMessage } from './public/utils/message.js';
import dotenv from 'dotenv';
import { userJoin, getCurrentUser, userLeave, getRoomUsers } from './public/utils/users.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

const botName = "ChatCord Bot";

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    socket.emit('message', formatMessage(botName, 'Welcome to EchoChat!'));

    socket.broadcast
      .to(user.room)
      .emit('message', formatMessage(botName, `${user.username} has joined the chat`));

   
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', formatMessage(user.username, msg));
    }
  });

 
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

     
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});