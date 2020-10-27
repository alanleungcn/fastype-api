const router = require('express').Router();

router.use(require('./api/leaderboard'));
router.use(require('./api/record'));
router.use(require('./api/signin'));
router.use(require('./api/text'));
router.use(require('./api/theme'));

module.exports = router;
