require('dotenv').config();
const axios = require('axios');
const router = require('express').Router();
const user = require('../../model/user.js');

router.post('/admin', async (req, res) => {
	if (req.body.key !== process.env.ADMIN_KEY) return res.sendStatus(400);
	const users = await user.find({}).lean();
	const utc = new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000;
	const now = new Date(utc + 1000 * 60 * 60 * 8);
	const yr = now.getFullYear();
	const mo = now.getMonth() + 1;
	let schoolYear = yr;
	if (mo < 9) schoolYear = yr - 1;
	const ref = await axios.get(
		`https://www2.pyc.edu.hk/pycnet/api/get_pyccode.php?schoolyear=${schoolYear}`
	);
	users.forEach((user) => {
		const item = ref.data.find((e) => e.pyccode === user.emailPrefix);
		if (!item) return;
		user.class = item.class;
		user.classNo = item.classno;
	});
	res.json({ users });
});

module.exports = router;
