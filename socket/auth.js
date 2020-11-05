const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.CLIENTID);
const user = require('../model/user.js');
const { initUser, userExist } = require('./user.js');

module.exports = async (socket, next) => {
	try {
		const ticket = await googleClient.verifyIdToken({
			idToken: socket.handshake.query.token,
			audience: process.env.CLIENTID
		});
		const payload = ticket.getPayload();
		const email = payload.email;
		const query = await user.find({ email: email }).select('name -_id');
		if (userExist(email)) throw new Error();
		initUser(email, query[0].name, socket.id);
		next();
	} catch (err) {
		next(new Error('authentication failed'));
	}
};
