const { getPublic, joinPublic, playerDisconnect, gameUpdate, playerFinish } = require('./game');
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
				io.in(roomId).emit('countdown', Date.now() + 3 * 1000);
		});
		socket.on('gameUpdate', (data) => {
			const roomInfo = gameUpdate(socket.id, data);
			if (!roomInfo) return
			io.in(roomInfo.roomId).emit('playerUpdate', roomInfo.players)
		})
		socket.on('playerFinish', () => {
			const roomInfo = playerFinish(socket.id);
			if (!roomInfo) return
			io.in(roomInfo.roomId).emit('playerUpdate', roomInfo.players)
		});
		socket.on('disconnect', () => {
			const room = playerDisconnect(socket.id);
			if (!room) return;
			io.in(room.roomId).emit('playerUpdate', room.players);
		});
	});
};
