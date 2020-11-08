module.exports = class Leaderboard {
	constructor(users) {
		const bestWpmList = users.map((e) => {
			return {
				name: e.name,
				email: e.email,
				wpm: e.stat.bestWpm.wpm,
				acc: e.stat.bestWpm.acc,
				time: e.stat.bestWpm.time,
				mode: e.stat.bestWpm.mode,
				date: e.stat.bestWpm.date
			};
		});
		this.bestWpm = bestWpmList.filter((e) => e.wpm > 0);
		this.bestWpm.sort((a, b) => b.wpm - a.wpm);
		this.bestWpm.forEach((e, i) => {
			e.rank = i + 1;
		});
		const bestDailyWpmList = users.map((e) => {
			return {
				name: e.name,
				email: e.email,
				wpm: e.stat.bestDailyWpm.wpm,
				acc: e.stat.bestDailyWpm.acc,
				time: e.stat.bestDailyWpm.time,
				mode: e.stat.bestDailyWpm.mode,
				date: e.stat.bestDailyWpm.date
			};
		});
		this.bestDailyWpm = bestDailyWpmList.filter((e) => {
			const start = new Date();
			start.setUTCHours(0, 0, 0, 0);
			return e.date > start && e.wpm > 0;
		});
		this.bestDailyWpm.sort((a, b) => b.wpm - a.wpm);
		this.bestDailyWpm.forEach((e, i) => {
			e.rank = i + 1;
		});
	}
	getRank(email) {
		const user = this.bestWpm.find((e) => e.email === email);
		if (user) return user.rank;
		else return 0;
	}
	getDailyRank(email) {
		const user = this.bestDailyWpm.find((e) => e.email === email);
		if (user) return user.rank;
		else return 0;
	}
};
