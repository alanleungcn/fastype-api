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
	if (!roomId) return;
	const room = rooms.get(roomId);
	if (!room) return;
	room.players.delete(socketId);
	//if (room.full) room.full = false;
	//console.log(players, rooms);
	return { roomId: roomId, players: Array.from(room.players, ([k, v]) => v) };
}

function leaveRoom(socketId) {
	const roomId = players.get(socketId).roomId;
	if (!roomId) return;
	const room = rooms.get(roomId);
	if (!room) return;
	room.players.delete(socketId);
	//if (room.full) room.full = false;
	return { roomId: roomId, players: Array.from(room.players, ([k, v]) => v) };
}

function gameUpdate(socketId, data) {
	const roomId = players.get(socketId).roomId;
	if (!roomId) return;
	const room = rooms.get(roomId);
	if (!room) return;
	room.players.get(socketId).wpm = data.wpm;
	room.players.get(socketId).progress = data.progress;
	/* console.log(room, players)
	console.log(room.players, players) */
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
	if (room.rank > room.players.size) {
		rooms.delete(roomId);
	}
	//console.log(players)
	return {
		roomId: roomId,
		players: Array.from(room.players, ([k, v]) => v)
	};
}

function joinPublic(socketId, roomId) {
	const player = players.get(socketId);
	players.get(socketId).roomId = roomId;
	const room = rooms.get(roomId);
	const playerCopy = {
		wpm: 0,
		progress: 0,
		name: player.name,
		email: player.email
	};
	room.players.set(socketId, playerCopy);
	if (room.players.size === 2) room.full = true; //FIXME
	//console.log(room.full);
	//console.log(rooms, players)
	return {
		text: room.text,
		players: Array.from(room.players, ([k, v]) => v),
		countdown: room.full ? true : false
	};
}

function joinPrivate(socketId, roomId) {
	const player = players.get(socketId);
	players.get(socketId).roomId = roomId;
	const room = rooms.get(roomId);
	const playerCopy = {
		wpm: 0,
		progress: 0,
		name: player.name,
		email: player.email
	};
	room.players.set(socketId, playerCopy);
	return {
		text: room.text,
		players: Array.from(room.players, ([k, v]) => v),
		roomId: roomId
	};
}

function votePrivate(socketId) {
	const roomId = players.get(socketId).roomId;
	const room = rooms.get(roomId);
	room.vote++;
	console.log(room);
	if (room.vote === room.players.size)
		return { roomId: roomId, countdown: true };
	return { roomId: roomId, countdown: false };
}

function getPublic() {
	if (rooms.size > 0) for (const [k, v] of rooms) if (!v.full) return k;
	const roomId = nanoid();
	createRoom(roomId, false);
	return roomId;
}

function getPrivate(roomId) {
	if (rooms.size > 0)
		for (const [k, v] of rooms) {
			console.log(k);
			if (!v.full && v.private && k === roomId) return k;
		}
}

function createRoom(roomId, private) {
	const text = [];
	const word = quote[Math.floor(Math.random() * quote.length)].split(' ');
	word.forEach((e) => text.push(e));
	rooms.set(roomId, {
		text: text,
		full: false,
		private: private,
		rank: 1,
		players: new Map(),
		vote: 0
	});
}

function createPrivate() {
	const roomId = nanoid();
	createRoom(roomId, true);
	return roomId;
}

module.exports = {
	initPlayer,
	playerExist,
	playerDisconnect,
	playerFinish,
	gameUpdate,
	getPublic,
	getPrivate,
	joinPublic,
	joinPrivate,
	createPrivate,
	votePrivate,
	leaveRoom
};
