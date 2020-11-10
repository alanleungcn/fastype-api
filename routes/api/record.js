const router = require('express').Router();
const Stat = require('../../class/stat');
const user = require('../../model/user.js');
const validateRecord = require('../../middleware/validator/record');

router.post('/record', validateRecord, async (req, res) => {
	const profile = await user.findOne({ email: req.body.email });
	const record = profile.record;
	const newRecord = req.body.record;
	newRecord.id = record.length + 1;
	record.push(newRecord);
	const stat = new Stat(record);
	await user.updateOne(
		{ email: req.body.email },
		{ $set: { record: record, stat: stat } }
	);
	res.json({ bestWpm: profile.stat.bestWpm.wpm });
});

router.get('/record', async (req, res) => {
	if (Object.keys(req.query).length > 0) {
		const query = await user.find(
			{ $or: [{ email: req.query.email }, { name: req.query.name }] },
			['name', 'stat']
		);
		if (query.length > 0)
			return res.json({ name: query[0].name, stat: query[0].stat });
		return res.json({ error: true });
	}
	const profile = await user.findOne({ email: req.body.email });
	res.json({
		stat: profile.stat,
		record: profile.record
	});
});

module.exports = router;
