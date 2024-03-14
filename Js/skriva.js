const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

mongoose.connect('mongodb://localhost:27017/chatApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const Message = mongoose.model('Message', {
    sender: String,
    content: String,
});

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
    console.log('Användare ansluten');

    socket.on('message', async (data) => {
        const message = new Message(data);
        await message.save();
        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        console.log('Användare frånkopplad');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server lyssnar på port ${PORT}`);
});

