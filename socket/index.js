const { getPublic, joinPublic, playerDisconnect } = require('./game');
const auth = require('./auth');

module.exports = (io) => {
	io.use(auth);
	io.on('connection', (socket) => {
		socket.on('joinPublic', () => {
			const roomId = getPublic();
			const players = joinPublic(socket.id, roomId);
			socket.join(roomId);
			io.in(roomId).emit('playerUpdate', players);
			socket.emit('joinRoom');
		});
		socket.on('disconnect', () => {
			const room = playerDisconnect(socket.id);
			if (!room) return
			io.in(room.roomId).emit('playerUpdate', room.players);
		});
	});
};
