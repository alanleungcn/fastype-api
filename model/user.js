const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	email: String,
	name: String,
	config: {
		type: Object,
		default: {
			theme: 'dark',
			custom: {
				name: 'custom',
				bgColor: '#111111',
				mainColor: '#dddddd',
				subColor: '#444444'
			}
		}
	},
	record: {
		type: Array,
		default: []
	},
	stat: {
		type: Object,
		default: {
			avgAcc: 0,
			avgWpm: 0,
			bestWpm: {
				wpm: 0,
				date: 0
			},
			bestDailyWpm: {
				wpm: 0,
				date: 0
			},
			totalRace: 0,
			lastTenAvgWpm: 0
		}
	}
});

module.exports = mongoose.model('users', userSchema);
