export default class GameController {
	constructor() {
		this.difficulty = 1;
		this.score = { user: 0, computer: 0 };
		this.timeFrame = 0;
		this.loosed = false;
	}
	random(min, max) {
		return (min + (Math.random() * (max - min)));
	}
	tick() {
		this.timeFrame += 1;
	}
	lose() {
		this.loosed = true;
	}
	randomDirection() {
		return Math.random() - 0.5 >= 0 ? 1 : -1;
	}
}