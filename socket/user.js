const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet(
	'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
	10
);
const quote = require('../assets/quote');
const players = new Map();
const rooms = new Map();

function initPlayer(socketId, email, name) {
	players.set(socketId, {
		name: name,
		email: email,
		roomId: null
	});
}

function playerExist(email) {
	for (const [k, v] of players) if (v.email === email) return true;
	return false;
}

function playerDisconnect(socketId) {
	const roomId = players.get(socketId).roomId;
	players.delete(socketId);
	const room = rooms.get(roomId);
	room.players.delete(socketId);
	if (room.full) room.full = false;
	console.log(players, rooms);
}

function joinPublic(socketId, roomId) {
	const player = players.get(socketId);
	players.get(socketId).roomId = roomId;
	console.log(roomId);
	const room = rooms.get(roomId);
	room.players.set(socketId, player);
	if (room.players.size === 5) room.full = true;
}

function getPublic() {
	if (rooms.size > 0) for (const [k, v] of rooms) if (!v.full) return k;
	const roomId = nanoid();
	createRoom(roomId);
	return roomId;
}

function createRoom(roomId) {
	const text = [];
	const word = quote[Math.floor(Math.random() * quote.length)].split(' ');
	word.forEach((e) => text.push(e));
	rooms.set(roomId, {
		text: text,
		full: false,
		players: new Map()
	});
}

module.exports = {
	initPlayer,
	playerExist,
	playerDisconnect,
	getPublic,
	joinPublic
};
