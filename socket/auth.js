const user = require('../model/user.js');
const { OAuth2Client } = require('google-auth-library');
const { initPlayer, playerExist } = require('./game.js');
const googleClient = new OAuth2Client(process.env.CLIENTID);

module.exports = async (socket, next) => {
	try {
		const ticket = await googleClient.verifyIdToken({
			idToken: socket.handshake.query.token,
			audience: process.env.CLIENTID
		});
		const payload = ticket.getPayload();
		const email = payload.email;
		if (playerExist(email)) throw new Error();
		const query = await user.find({ email: email }, ['name', '-_id']);
		initPlayer(socket.id, query[0].name, email);
		next();
	} catch (err) {
		next(new Error('Authentication failed'));
	}
};
