import Server from 'socket.io';

export default function startServer(store) {
    const io = new Server().attach(8090);

    //TODO create a socket io room and only send the state of the room
    store.subscribe(
        () => io.emit('state', store.getState().toJS())
    );

    io.on('connection', (socket) => {
        console.log('player connected');
        socket.emit('state', store.getState().toJS());
        socket.on('action', store.dispatch.bind(store));
        socket.on('roomCode', (roomCode) => {
            console.log('in room');
            socket.join(roomCode);
            // everyone except sender - socket.broadcast.to(roomCode).emit('code',
            io.to(roomCode).emit('code',
                roomCode)
        });
    });
}