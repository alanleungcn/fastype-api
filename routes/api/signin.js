const express = require('express');
const router = express.Router();
require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.CLIENTID);
const user = require('../../model/user.js');

router.post('/signin', async (req, res) => {
	const ticket = await googleClient
		.verifyIdToken({
			idToken: req.headers.authorization,
			audience: process.env.CLIENTID
		})
		.catch((err) => {
			res.sendStatus(401);
		});
	if (!ticket) return;
	const payload = ticket.getPayload();
	const email = payload.email;
	const name = payload.name;
	/* const nameExist = await user.exists({ name: name }); */
	const userExist = await user.exists({ email: email });
	if (!userExist) {
		const account = new user({
			email: email,
			name: name
		});
		await account.save();
	}
	res.sendStatus(200);
});

module.exports = router;
