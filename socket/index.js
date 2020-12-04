const {
	getPublic,
	getPrivate,
	joinPublic,
	playerDisconnect,
	gameUpdate,
	playerFinish,
	createPrivate,
	joinPrivate,
	leaveRoom
} = require('./game');
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
		socket.on('joinPrivate', (data) => {
			const roomId = getPrivate(data.roomId);
			if (!roomId) return socket.emit('roomError');
			const roomInfo = joinPrivate(socket.id, roomId);
			socket.join(roomId);
			io.in(roomId).emit('playerUpdate', roomInfo.players);
			socket.emit('joinPrivateRoom', {
				text: roomInfo.text,
				roomId: roomInfo.roomId
			});
			console.log(roomInfo);
			//private room handling
		});
		socket.on('createRoom', () => {
			const roomId = createPrivate();
			if (!roomId) return socket.emit('roomError');
			const roomInfo = joinPrivate(socket.id, roomId);
			socket.join(roomId);
			io.in(roomId).emit('playerUpdate', roomInfo.players);
			socket.emit('joinPrivateRoom', {
				text: roomInfo.text,
				roomId: roomInfo.roomId
			});
			console.log(roomInfo);
		});
		socket.on('leaveRoom', () => {
			const room = leaveRoom(socket.id);
			if (!room) return;
			socket.leave(room.roomId);
			io.in(room.roomId).emit('playerUpdate', room.players);
		});
		socket.on('gameUpdate', (data) => {
			const roomInfo = gameUpdate(socket.id, data);
			if (!roomInfo) return;
			io.in(roomInfo.roomId).emit('playerUpdate', roomInfo.players);
		});
		socket.on('playerFinish', () => {
			const roomInfo = playerFinish(socket.id);
			if (!roomInfo) return;
			io.in(roomInfo.roomId).emit('playerUpdate', roomInfo.players);
		});
		socket.on('disconnect', () => {
			const room = playerDisconnect(socket.id);
			if (!room) return;
			io.in(room.roomId).emit('playerUpdate', room.players);
		});
	});
};
