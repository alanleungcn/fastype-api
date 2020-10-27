const express = require('express');
const router = express.Router();
const user = require('../../model/user.js');

router.get('/theme', async (req, res) => {
	const profile = await user.findOne({ email: req.body.email });
	const config = profile.config;
	res.json({ theme: config.theme, custom: config.custom });
});

router.post('/theme', async (req, res) => {
	if (req.body.theme) {
		if (typeof req.body.theme !== 'string') return res.sendStatus(400);
		await user.updateOne(
			{ email: req.body.email },
			{ $set: { 'config.theme': req.body.theme } }
		);
		res.sendStatus(200);
	} else if (req.body.custom) {
		if (typeof req.body.custom !== 'object') return res.sendStatus(400);
		await user.updateOne(
			{ email: req.body.email },
			{ $set: { 'config.theme': 'custom', 'config.custom': req.body.custom } }
		);
		res.sendStatus(200);
	}
});

module.exports = router;
