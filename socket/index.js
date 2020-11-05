const { availPublic, joinPublic, userDisconnect } = require('./user');
const auth = require('./auth');

module.exports = (io) => {
	io.use(auth);
	io.on('connection', (socket) => {
		socket.on('joinPublic', () => {
			const roomId = availPublic();
			const room = joinPublic(socket.id, roomId);
			socket.join(roomId);
			socket.emit('joinRoom', room.text);
		});
		socket.on('disconnect', () => {
			userDisconnect(socket.id);
			socket.disconnect();
		});
	});
};
