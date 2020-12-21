const {
	initPlayer,
	playerDisconnect,
	leaveRoom,
	gameUpdate,
	playerFinish,
	joinPublic,
	joinPrivate,
	getPublic,
	getPrivate,
	votePrivate,
	createPrivate,
	getPlayerSize
} = require('./game');
const auth = require('./auth');

module.exports = (io) => {
	io.use(auth);
	io.on('connection', (socket) => {
		initPlayer(
			socket.id,
			socket.handshake.query.name,
			socket.handshake.query.email
		);
		io.emit('playerSize', getPlayerSize());
		socket.on('joinPublic', () => {
			const roomId = getPublic();
			const roomInfo = joinPublic(socket.id, roomId);
			socket.join(roomId);
			io.in(roomId).emit('playerUpdate', roomInfo.players);
			socket.emit('joinRoom', roomInfo.text);
			if (roomInfo.countdown) io.in(roomId).emit('countdown');
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
		});
		socket.on('vote', () => {
			const roomInfo = votePrivate(socket.id);
			io.in(roomInfo.roomId).emit('updateVote', roomInfo.vote);
			if (roomInfo.countdown) io.in(roomInfo.roomId).emit('countdown');
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
		socket.on('leaveRoom', () => {
			const room = leaveRoom(socket.id);
			if (!room) return;
			socket.leave(room.roomId);
			io.in(room.roomId).emit('playerUpdate', room.players);
		});
		socket.on('disconnect', () => {
			const room = playerDisconnect(socket.id);
			io.emit('playerSize', getPlayerSize());
			if (!room) return;
			io.in(room.roomId).emit('playerUpdate', room.players);
		});
	});
};
