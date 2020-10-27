const express = require('express');
const router = express.Router();
const user = require('../../model/user.js');
let cache = {
	data: null,
	time: null
};

router.get('/leaderboard', async (req, res) => {
	if (cache.time > Date.now() - 60 * 1000) return res.json(cache.data);
	const stat = await user.find({}, ['email', 'name', 'stat']);
	const bestWpmArr = stat.map((e) => {
		return {
			email: e.email,
			name: e.name,
			wpm: e.stat.bestWpm.wpm,
			mode: e.stat.bestWpm.mode,
			date: e.stat.bestWpm.date
		};
	});
	const bestDailyWpmArr = stat.map((e) => {
		return {
			email: e.email,
			name: e.name,
			wpm: e.stat.bestDailyWpm.wpm,
			mode: e.stat.bestDailyWpm.mode,
			date: e.stat.bestDailyWpm.date
		};
	});
	const bestDailyWpm = bestDailyWpmArr.filter((e) => {
		const today = new Date();
		const recordDate = new Date(e.date);
		return (
			recordDate.getFullYear() === today.getFullYear() &&
			recordDate.getMonth() === today.getMonth() &&
			recordDate.getDate() === today.getDate()
		);
	});
	bestDailyWpm.sort((a, b) => b.wpm - a.wpm);
	const bestWpm = bestWpmArr.filter((e) => e.wpm > 0);
	bestWpm.sort((a, b) => b.wpm - a.wpm);
	const bestDailyWpmRank =
		bestDailyWpm.findIndex((e) => e.email === req.body.email) + 1;
	const bestWpmRank = bestWpm.findIndex((e) => e.email === req.body.email) + 1;
	bestWpm.forEach((e, i) => {
		e.rank = i + 1;
	});
	bestDailyWpm.forEach((e, i) => {
		e.rank = i + 1;
	});
	cache.data = {
		bestWpm: {
			list: bestWpm,
			rank: bestWpmRank
		},
		bestDailyWpm: {
			list: bestDailyWpm,
			rank: bestDailyWpmRank
		}
	};
	cache.time = Date.now();
	res.json(cache.data);
});

module.exports = router;
