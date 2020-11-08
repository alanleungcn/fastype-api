module.exports = class Stat {
	constructor(record) {
		if (record.length === 0) {
			this.totalRace = 0;
			this.avgWpm = 0;
			this.avgAcc = 0;
			this.bestWpm = {
				wpm: 0,
				acc: 0,
				time: null,
				mode: null,
				date: null
			};
			this.bestDailyWpm = {
				wpm: 0,
				acc: 0,
				time: null,
				mode: null,
				date: null
			};
			this.lastTenAvgWpm = 0;
			return;
		}
		const wpm = record.map((e) => e.wpm);
		const acc = record.map((e) => e.acc);
		const dailyRecord = record.filter((e) => {
			const start = new Date();
			start.setUTCHours(0, 0, 0, 0);
			return e.date > start;
		});
		const bestWpmIdx = wpm.indexOf(Math.max(...wpm));
		const bestDailyWpmIdx = dailyRecord
			.map((e) => e.wpm)
			.indexOf(Math.max(...dailyRecord.map((e) => e.wpm)));
		this.totalRace = record.length;
		this.totalTime = Math.round(
			record.map((e) => e.time).reduce((a, b) => a + b) / 60
		);
		this.avgWpm = Math.round(wpm.reduce((a, b) => a + b) / wpm.length);
		this.avgAcc = Math.round(acc.reduce((a, b) => a + b) / acc.length);
		if (bestWpmIdx < 0) return;
		this.bestWpm = {
			wpm: record[bestWpmIdx].wpm,
			acc: record[bestWpmIdx].acc,
			time: record[bestWpmIdx].time,
			mode: record[bestWpmIdx].mode,
			date: record[bestWpmIdx].date
		};
		if (bestDailyWpmIdx < 0) return;
		this.bestDailyWpm = {
			wpm: dailyRecord[bestDailyWpmIdx].wpm,
			acc: dailyRecord[bestDailyWpmIdx].acc,
			time: dailyRecord[bestDailyWpmIdx].time,
			mode: dailyRecord[bestDailyWpmIdx].mode,
			date: dailyRecord[bestDailyWpmIdx].date
		};
		this.lastTenAvgWpm = Math.round(
			record
				.slice(-10)
				.reverse()
				.map((e) => e.wpm)
				.reduce((a, b) => a + b) / record.slice(-10).length
		);
		if (this.lastTenAvgWpm >= 0 && this.lastTenAvgWpm < 10) this.level = 1;
		if (this.lastTenAvgWpm >= 10 && this.lastTenAvgWpm < 20) this.level = 2;
		if (this.lastTenAvgWpm >= 20 && this.lastTenAvgWpm < 30) this.level = 3;
		if (this.lastTenAvgWpm >= 30 && this.lastTenAvgWpm < 40) this.level = 4;
		if (this.lastTenAvgWpm >= 40 && this.lastTenAvgWpm < 50) this.level = 5;
		if (this.lastTenAvgWpm >= 50 && this.lastTenAvgWpm < 60) this.level = 6;
		if (this.lastTenAvgWpm >= 60 && this.lastTenAvgWpm < 70) this.level = 7;
		if (this.lastTenAvgWpm >= 70 && this.lastTenAvgWpm < 80) this.level = 8;
		if (this.lastTenAvgWpm >= 80 && this.lastTenAvgWpm < 90) this.level = 9;
		if (this.lastTenAvgWpm >= 90 && this.lastTenAvgWpm < 100) this.level = 10;
		if (this.lastTenAvgWpm >= 100 && this.lastTenAvgWpm < 110) this.level = 11;
		if (this.lastTenAvgWpm > 110) this.level = 12;
	}
};
