const { getPublic, joinPublic, playerDisconnect } = require('./game');
const auth = require('./auth');

module.exports = (io) => {
	io.use(auth);
	io.on('connection', (socket) => {
		socket.on('joinPublic', () => {
			const roomId = getPublic();
			const roomInfo = joinPublic(socket.id, roomId);
			socket.join(roomId);
			io.in(roomId).emit('playerUpdate', roomInfo.players);
			socket.emit('joinRoom', roomInfo.text);
			if (roomInfo.countdown)
				io.in(roomId).emit('countdown', Date.now() + 10 * 1000);
		});
		socket.on('disconnect', () => {
			const room = playerDisconnect(socket.id);
			if (!room) return;
			io.in(room.roomId).emit('playerUpdate', room.players);
		});
	});
};
