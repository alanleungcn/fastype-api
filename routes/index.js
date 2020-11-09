const router = require('express').Router();

router.use(require('./api/text'));
router.use(require('./api/signin'));
router.use(require('../middleware/auth.js'));
router.use(require('./api/theme'));
router.use(require('./api/record'));
router.use(require('./api/leaderboard'));

module.exports = router;
