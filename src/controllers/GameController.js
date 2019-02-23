export default class GameController {
	constructor() {
		this.difficulty = 1;
		this.score = { userScore: 0, computerScore: 0 };
		this.timeFrame = 0;
		this.isLoosed = false;
		this.isWinned = false;
		this.isTie = false;
		this.aiReaction = 3;
		this.aiFrequency = 5;
		this.aiError = 60;
		this.prediction = { x: 0, y: 0 };
	}
	random(min, max) {
		return (min + (Math.random() * (max - min)));
	}
	tick() {
		this.timeFrame += 1;
	}
	lose() {
		this.score.computerScore += 1;
		if (this.score.computerScore > 6) {
			if (this.score.userScore > 6) {
				this.isTie = true;
				this.isStarted = false;
				return;
			}
			this.isLoosed = false;
			this.isStarted = false;
			return;
		}
		this.timeFrame = 0;
	}
	start() {
		this.isStarted = true;
	}
	goal() {
		this.score.userScore += 1;
		if (this.score.userScore > 6) {
			if (this.score.computerScore > 6) {
				this.isTie = true;
				this.isStarted = false;
				return;
			}
			this.isWinned = true;
			this.isStarted = false;
			return;
		}
		this.timeFrame = 0;
	}
	reset() {
		this.isLoosed = false;
		this.isTie = false;
		this.isWinned = false;
	}
	randomDirection() {
		return Math.random() - 0.5 >= 0 ? 1 : -1;
	}
	predict(ball) {
		const diff = this.score.computerScore - this.score.userScore;
		const margin = diff / 2 * this.aiError;
		const violation = this.aiError + margin;
		const error = violation < 0 ? 0 : violation;
		const quart = error / 4;
		this.aiFrequency = quart > 0 ? quart : 5;
		if (this.timeFrame % this.aiFrequency === 0) {
			if (ball.dy < 0) {
				const reaction = this.random(1, this.aiReaction);
				const x = ball.x + ball.dx * reaction + this.random(-error, error);
				if (this.prediction.x !== x)
					this.prediction = { x: x, y: 0 };
			}
		}
	}
}