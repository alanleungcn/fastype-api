const router = require('express').Router();
const user = require('../../model/user.js');
const Stat = require('../../class/stat');
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
	res.json({ bestWpm: stat.bestWpm.wpm });
});

router.get('/record', async (req, res) => {
	const profile = await user.findOne({ email: req.body.email });
	const stat = new Stat(profile.record);
	res.json({
		stat: stat,
		record: profile.record
	});
});

module.exports = router;
