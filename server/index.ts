import * as http from 'http';
import app from './app';

const server = http.createServer(app);
const port = 4000;
server.listen(port, () => console.log('im running on port',port));

const io = require('socket.io')(server);

io.on('connection', (socket)=> {
    console.log('new connection:', socket.id);

    socket.on('chat', function(){
        io.sockets.emit('chat');
    });

    socket.on('disconnect', () => {
        console.log('disconnect:', socket.id);
    });
});