const express = require('express');
const router = express.Router();
const user = require('../../model/user.js');
const validateRecord = require('../../middleware/validator/record');

router.post('/record', validateRecord, async (req, res) => {
	if (!req.body.record) return res.sendStatus(400);
	// add record
	const total = await user.aggregate([
		{ $match: { email: req.body.email } },
		{ $project: { id: { $size: '$record' } } }
	]);
	const record = req.body.record;
	record.id = total[0].id + 1;
	await user.updateOne(
		{ email: req.body.email },
		{ $push: { record: record } }
	);
	// update stat
	const profile = await user.findOne({ email: req.body.email });
	const wpm = profile.record.map((e) => {
		return e.wpm;
	});
	const acc = profile.record.map((e) => {
		return e.acc;
	});
	const totalRace = profile.record.length;
	const avgWpm = Math.round(wpm.reduce((a, b) => a + b) / wpm.length);
	const avgAcc = Math.round(acc.reduce((a, b) => a + b) / acc.length);
	const bestWpmIdx = wpm.indexOf(Math.max(...wpm));
	const bestWpmDate = profile.record[bestWpmIdx].date;
	const bestWpmMode = profile.record[bestWpmIdx].mode;
	const bestWpm = Math.max(...wpm);
	const dailyRecord = profile.record.filter((e) => {
		const today = new Date();
		const recordDate = new Date(e.date);
		return (
			recordDate.getFullYear() === today.getFullYear() &&
			recordDate.getMonth() === today.getMonth() &&
			recordDate.getDate() === today.getDate()
		);
	});
	const bestDailyWpmIdx = dailyRecord
		.map((e) => {
			return e.wpm;
		})
		.indexOf(
			Math.max(
				...dailyRecord.map((e) => {
					return e.wpm;
				})
			)
		);
	const bestDailyWpm = dailyRecord[bestDailyWpmIdx].wpm;
	const bestDailyWpmDate = dailyRecord[bestDailyWpmIdx].date;
	const bestDailyWpmMode = dailyRecord[bestDailyWpmIdx].mode;
	const lastTen = profile.record.slice(-10).reverse();
	const lastTenWpm = lastTen.map((obj) => {
		return obj.wpm;
	});
	const lastTenAvgWpm = Math.round(
		lastTenWpm.reduce((a, b) => a + b) / lastTenWpm.length
	);
	const stat = {
		totalRace: totalRace,
		avgWpm: avgWpm,
		avgAcc: avgAcc,
		bestWpm: {
			wpm: bestWpm,
			mode: bestWpmMode,
			date: bestWpmDate
		},
		bestDailyWpm: {
			wpm: bestDailyWpm,
			mode: bestDailyWpmMode,
			date: bestDailyWpmDate
		},
		lastTenAvgWpm: lastTenAvgWpm
	};
	await user.updateOne({ email: req.body.email }, { $set: { stat: stat } });
	res.json({ bestWpm: bestWpm.wpm });
});

router.get('/record', async (req, res) => {
	const profile = await user.findOne({ email: req.body.email });
	const record = profile.record;
	const start = new Date();
	start.setHours(0, 0, 0, 0);
	const date = start - 1000 * 60 * 60 * 24 * 7;
	const pastSevenDay = record.filter((e) => e.date > date);
	let progression = [];
	pastSevenDay.reduce((a, e) => {
		const recordDate = new Date(e.date);
		recordDate.setHours(0, 0, 0, 0);
		const diff = (recordDate - date) / (1000 * 60 * 60 * 24) - 1;
		if (!progression[diff]) progression[diff] = [];
		progression[diff].push(e.wpm);
		return progression;
	}, {});
	for (let i = 0; i < 7; i++) {
		if (!progression[i]) progression[i] = [0];
	}
	progression.forEach((e, i) => {
		progression[i] = Math.round(e.reduce((a, b) => a + b) / e.length);
	});
	res.json({
		stat: {
			avgAcc: profile.stat.avgAcc,
			avgWpm: profile.stat.avgWpm,
			bestWpm: profile.stat.bestWpm.wpm,
			totalRace: profile.stat.totalRace,
			lastTenAvgWpm: profile.stat.lastTenAvgWpm
		},
		record: record,
		progression: progression
	});
});

module.exports = router;
