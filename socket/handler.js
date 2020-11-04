const auth = require('./auth');
const { join, avaliableRoom } = require('./user');

async function joinPublic(socket, token) {
	const userData = await auth(token);
	if (!userData.success) return socket.emit('authFail');
	const room = avaliableRoom();
	socket.join(room);
	join(userData, room);
}

module.exports = {
	joinPublic
};
