module.exports = (req, res, next) => {
	const record = req.body.record;
	if (
		typeof record.wpm !== 'number' ||
		typeof record.acc !== 'number' ||
		typeof record.time !== 'number' ||
		typeof record.date !== 'number' ||
		typeof record.mode !== 'string' ||
		!Array.isArray(record.wpmPerSec) ||
		!Array.isArray(record.rawWpmPerSec)
	)
		return res.sendStatus(400);
	next();
};
