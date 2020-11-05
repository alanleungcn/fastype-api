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

function joinPublic(id, roomId) {
	const userIdx = users.findIndex((e) => e.id === id);
	if (users[userIdx].room) return;
	const roomIdx = rooms.findIndex((e) => e.id === roomId);
	rooms[roomIdx].players.push({
		email: users[userIdx].email,
		name: users[userIdx].name
	});
	users[userIdx].room = roomId;
	return rooms[roomIdx];
}

function userDisconnect(id) {
	console.log(id);
	const idx = users.findIndex((e) => e.id === id);
	users.splice(idx, 1);
}

function userExist(email) {
	const idx = users.findIndex((e) => e.email === email);
	if (idx === -1) return false;
	return true;
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
	let text = [];
	const word = quote[Math.floor(Math.random() * quote.length)].split(' ');
	word.forEach((e) => text.push(e));
	rooms.push({
		id: roomId,
		text: text,
		players: []
	});
}

module.exports = {
	initUser,
	userExist,
	userDisconnect,
	availPublic,
	joinPublic
};
