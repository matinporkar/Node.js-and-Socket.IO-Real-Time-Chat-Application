import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "node:path";
import { fileURLToPath } from 'node:url';
import messageFormat from "./utils/message.format.js";
import { joinUser, getCurrentuser, userLeave, getRoomUsers } from "./services/user.service.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server);

const PORT = 3000 || process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname, "public")));


io.on("connection", socket => {
    console.log("Client Connected");

    socket.on('joinRoom', ({ username, room }) => {

        const user = joinUser(socket.id, username, room);

        socket.join(user.room);

        socket.emit('message', messageFormat('سرور', 'به چت خوش آمدید.'));
        socket.broadcast.to(user.room).emit('message', messageFormat('سرور', `${user.username} به چت پیوست.`));

        socket.on('disconnect', () => {
            const user = userLeave(socket.id);
            io.to(user.room).emit('message', messageFormat(user.username, `${user.username} چت را ترک کرد.`));
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        });

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });

    socket.on('chatMessage', (message) => {
        const user = getCurrentuser(socket.id);
        io.to(user.room).emit('message', messageFormat(`${user.username}`, message));
    });
});

server.listen(PORT, () => {
    console.log("Listening On Port 3000...");
});