const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: String,
	email: String,
	emailPrefix: String,
	config: {
		type: Object,
		default: {
			theme: 'dark',
			custom: {
				name: 'custom',
				bgColor: '#111111',
				mainColor: '#dddddd',
				subColor: '#777777'
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
			level: 1,
			avgWpm: 0,
			avgAcc: 0,
			totalRace: 0,
			totalTime: 0,
			lastTenAvgWpm: 0,
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
			}
		}
	}
});

module.exports = mongoose.model('users', userSchema);
