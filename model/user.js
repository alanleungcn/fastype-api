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
				acc: 0,
				time: null,
				mode: null,
				date: null
			},
			bestDailyWpm: {
				wpm: 0,
				acc: 0,
				time: null,
				mode: null,
				date: null
			},
			totalRace: 0,
			totalTime: 0,
			lastTenAvgWpm: 0,
			level: 1
		}
	}
});

module.exports = mongoose.model('users', userSchema);
