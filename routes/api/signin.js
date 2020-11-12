const router = require('express').Router();
const user = require('../../model/user.js');
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.CLIENTID);

router.post('/signin', async (req, res) => {
	try {
		const ticket = await googleClient.verifyIdToken({
			idToken: req.headers.authorization,
			audience: process.env.CLIENTID
		});
		const payload = ticket.getPayload();
		const name = payload.name;
		const email = payload.email;
		const exist = await user.exists({ email: email });
		if (!exist) {
			const account = new user({
				name: name,
				email: email
			});
			await account.save();
		}
		const profile = await user.find({ email: email }, [
			'config',
			'email',
			'name',
			'-_id'
		]);
		res.json({
			name: profile[0].name,
			email: profile[0].email,
			config: profile[0].config
		});
	} catch (err) {
		res.sendStatus(401);
	}
});

module.exports = router;
