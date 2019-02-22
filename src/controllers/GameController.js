export default class GameController {
	constructor() {
		this.difficulty = 1;
		this.score = { user: 0, computer: 0 };
		this.timeFrame = 0;
		this.loosed = false;
		this.aiReaction = 5;
		this.aiError = 10;
		this.since = 0;
		this.prediction = { x: 0, y: 0 };
	}
	random(min, max) {
		return (min + (Math.random() * (max - min)));
	}
	tick() {
		this.timeFrame += 1;
	}
	lose() {
		this.score.computer += 1;
		this.timeFrame = 0;
	}
	goal() {
		this.score.user += 1;
		this.timeFrame = 0;
	}
	randomDirection() {
		return Math.random() - 0.5 >= 0 ? 1 : -1;
	}
	predict(ball) {
		if (this.timeFrame % this.aiError === 0) {
			if (ball.dy < 0) {
				const reaction = this.random(1, this.aiReaction);
				const x = ball.x + ball.dx * reaction;
				const y = ball.y + ball.dy * reaction;
				if (this.prediction.x !== x && this.prediction.y !== y)
					this.prediction = { x: x, y: y };
			}
		}
	}
}