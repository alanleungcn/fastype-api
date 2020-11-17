const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet(
	'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
	10
);
const quote = require('../assets/quote');
const players = new Map();
const rooms = new Map();

function initPlayer(socketId, name, email) {
	players.set(socketId, {
		name: name,
		email: email,
		roomId: null,
		wpm: 0,
		progress: 0
	});
}

function playerExist(email) {
	for (const [k, v] of players) if (v.email === email) return true;
	return false;
}

function playerDisconnect(socketId) {
	const roomId = players.get(socketId).roomId;
	players.delete(socketId);
	if (!roomId) return;
	const room = rooms.get(roomId);
	if (!room) return;
	room.players.delete(socketId);
	if (room.full) room.full = false;
	console.log(players, rooms);
	return { roomId: roomId, players: Array.from(room.players, ([k, v]) => v) };
}

function gameUpdate(socketId, data) {
	const roomId = players.get(socketId).roomId;
	if (!roomId) return;
	const room = rooms.get(roomId);
	if (!room) return;
	const player = room.players.get(socketId);
	player.wpm = data.wpm;
	player.progress = data.progress;
	return {
		roomId: roomId,
		players: Array.from(room.players, ([k, v]) => v)
	};
}

function playerFinish(socketId) {
	const roomId = players.get(socketId).roomId;
	if (!roomId) return;
	const room = rooms.get(roomId);
	const player = room.players.get(socketId);
	player.rank = room.rank;
	room.rank++;
	if (room.rank > 2) {
		rooms.delete(roomId);
	}
	return {
		roomId: roomId,
		players: Array.from(room.players, ([k, v]) => v)
	};
}

function joinPublic(socketId, roomId) {
	const player = players.get(socketId);
	players.get(socketId).roomId = roomId;
	console.log(roomId);
	const room = rooms.get(roomId);
	room.players.set(socketId, player);
	if (room.players.size === 2) room.full = true; //FIXME
	return {
		text: room.text,
		players: Array.from(room.players, ([k, v]) => v),
		countdown: room.full ? true : false
	};
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
		rank: 1,
		players: new Map()
	});
}

module.exports = {
	initPlayer,
	playerExist,
	playerDisconnect,
	playerFinish,
	gameUpdate,
	getPublic,
	joinPublic
};
