const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.CLIENTID);

module.exports = async (req, res, next) => {
	if (req._parsedUrl.pathname === '/api/text') return next();
	if (!req.headers.authorization) return res.sendStatus(401);
	const ticket = await googleClient
		.verifyIdToken({
			idToken: req.headers.authorization,
			audience: process.env.CLIENTID
		})
		.catch((err) => {
			res.sendStatus(401);
		});
	if (!ticket) return res.sendStatus(401);
	const payload = ticket.getPayload();
	req.body.email = payload.email;
	next();
};
