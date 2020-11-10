const quote = require('../assets/quote');
const users = [];
const rooms = [];

function initUser(email, name, id) {
	users.push({
		email: email,
		name: name,
		id: id
	});
}

function userExist(email) {
	const idx = users.findIndex((e) => e.email === email);
	if (idx === -1) return false;
	return true;
}

function userDisconnect(id) {
	const userIdx = users.findIndex((e) => e.id === id);
	const roomIdx = rooms.findIndex((e) => e.id === users[userIdx].room);
	const playerIdx = rooms[roomIdx].players.findIndex((e) => e.id === id)
	rooms[roomIdx].players.splice(playerIdx, 1);
	users.splice(userIdx, 1);
	console.log(users, rooms)
}

function availPublic() {
	const freeRoom = rooms.find((e) => e.players.length < 5);
	if (!freeRoom) {
		const roomId =
			Date.now() +
			Math.round(Math.random() * 1000)
				.toString()
				.padStart(3, '0');
		createRoom(roomId);
		return roomId;
	} else {
		return freeRoom.id;
	}
}

function createRoom(roomId) {
	const text = [];
	const word = quote[Math.floor(Math.random() * quote.length)].split(' ');
	word.forEach((e) => text.push(e));
	rooms.push({
		id: roomId,
		text: text,
		players: []
	});
}

function joinPublic(id, roomId) {
	const userIdx = users.findIndex((e) => e.id === id);
	if (users[userIdx].room) return;
	const roomIdx = rooms.findIndex((e) => e.id === roomId);
	rooms[roomIdx].players.push(users[userIdx]);
	users[userIdx].room = roomId;
	return rooms[roomIdx];
}

module.exports = {
	initUser,
	userExist,
	userDisconnect,
	availPublic,
	joinPublic
};
