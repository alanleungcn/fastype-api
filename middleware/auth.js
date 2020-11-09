const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.CLIENTID);

module.exports = async (req, res, next) => {
	try {
		const ticket = await googleClient.verifyIdToken({
			idToken: req.headers.authorization,
			audience: process.env.CLIENTID
		});
		const payload = ticket.getPayload();
		req.body.email = payload.email;
		next();
	} catch (err) {
		res.sendStatus(401);
	}
};
