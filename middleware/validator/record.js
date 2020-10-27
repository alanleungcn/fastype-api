module.exports = (req, res, next) => {
	const record = req.body.record;
	if (
		record.date > Date.now() ||
		record.date < Date.now() - 1000 * 60 ||
		typeof record.date !== 'number'
	) {
		return res.sendStatus(400);
	} else if (
		typeof record.wpm !== 'number' ||
		typeof record.acc !== 'number' ||
		typeof record.time !== 'number' ||
		typeof record.mode !== 'string' ||
		!Array.isArray(record.wpmPerSec)
	) {
		return res.sendStatus(400);
	} else {
		next();
	}
};
