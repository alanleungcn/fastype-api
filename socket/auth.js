const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.CLIENTID);
const user = require('../model/user.js');

module.exports = async (token) => {
	try {
		const ticket = await googleClient.verifyIdToken({
			idToken: token,
			audience: process.env.CLIENTID
		});
		const payload = ticket.getPayload();
		const email = payload.email;
		const name = await user.find({ email: email }).select('name -_id');
		return {
			success: true,
			name: name[0].name,
			email: email
		};
	} catch (err) {
		return {
			success: false
		};
	}
};
