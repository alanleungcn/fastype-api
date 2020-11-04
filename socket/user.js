const users = [];
const rooms = [{ id: '123', players: [1, 2, 3, 4, 5] } ];

function join(userData, room) {
  const user = users.find((e) => e.email === userData.email);
  if (user) return
	users.push({
		email: userData.email,
		name: userData.name,
		room: room
	});
  const roomIdx = rooms.findIndex((e) => e.id === room);
	rooms[roomIdx].players.push({
		email: userData.email,
		name: userData.name
	});
	console.log(users, rooms);
}

function avaliableRoom() {
  const freeRoom = rooms.find((e) => e.players.length < 5);
	if (rooms.length === 0 || !freeRoom) {
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
	rooms.push({
		id: roomId,
		players: []
	});
}

module.exports = {
	join,
	avaliableRoom,
	createRoom
};
