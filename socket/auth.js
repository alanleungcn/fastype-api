const user = require('../model/user.js');
const { initUser, userExist } = require('./user.js');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.CLIENTID);

module.exports = async (socket, next) => {
	try {
		const ticket = await googleClient.verifyIdToken({
			idToken: socket.handshake.query.token,
			audience: process.env.CLIENTID
		});
		const payload = ticket.getPayload();
		const email = payload.email;
		if (userExist(email)) throw new Error();
		const query = await user.find({ email: email }, ['name', '-_id']);
		initUser(email, query[0].name, socket.id);
		next();
	} catch (err) {
		next(new Error('authentication failed'));
	}
};
