const router = require('express').Router();
const word = require('../../assets/word.json');
const quote = require('../../assets/quote.json');

router.get('/text', (req, res) => {
	if (!req.query.length) return res.sendStatus(400);
	const text = [];
	if (req.query.length > 0) {
		while (req.query.length--)
			text.push(word[Math.floor(Math.random() * word.length)]);
	} else {
		const word = quote[Math.floor(Math.random() * quote.length)].split(' ');
		word.forEach((e) => text.push(e));
	}
	res.json({ text: text });
});

module.exports = router;
