const handler = require('./handler');

module.exports = (io) => {
	io.on('connection', (socket) => {
		socket.on('joinPublic', (data) => {
			handler.joinPublic(socket, data.token);
		});
	});
};
