const router = require('express').Router();
const user = require('../../model/user.js');
const Leaderboard = require('../../class/leaderboard');

router.get('/leaderboard', async (req, res) => {
	const users = await user.find({}, ['email', 'name', 'stat']);
	const leaderboard = new Leaderboard(users);
	res.json({
		bestWpm: {
			list: leaderboard.bestWpm,
			rank: leaderboard.getRank(req.body.email)
		},
		bestDailyWpm: {
			list: leaderboard.bestDailyWpm,
			rank: leaderboard.getDailyRank(req.body.email)
		}
	});
});

module.exports = router;
