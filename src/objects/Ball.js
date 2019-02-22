import Dot from './Dot';

const getDistance = (pos1, pos2) =>
	Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2);

export default class extends Dot {
	constructor(game, fieldWidth, fieldHeight, radius, id) {
		super(fieldWidth / 2, fieldHeight / 2, radius, 'white');
		this.doubleRadius = radius * 2;
		this.centerX = fieldWidth / 2;
		this.centerY = fieldHeight / 2;
		this.game = game;
		this.maxX = fieldWidth - radius;
		this.maxY = fieldHeight - radius;
		this.minX = radius;
		this.minY = radius;
		this.speed = 3;
		this.dx = this.speed * game.randomDirection();
		this.dy = this.speed * game.randomDirection();
		this.totalAcceleration = Math.abs(this.dx) + Math.abs(this.dy);
		this.acceleration = 0;
		this.id = id;
	}
	static ballActivity(b) {
		const { userPaddle, computerPaddle, wave } = this.state;
		const userPaddleCenter = userPaddle.x;
		const computerPaddleCenter = computerPaddle.x;
		this.game.predict(b);
		const prediction = this.game.prediction;

		if (prediction) {
			if (computerPaddle.x + b.radius < prediction.x) {
				this.moveComputerRight();
			} else if (computerPaddle.x - b.radius > prediction.x) {
				this.moveComputerLeft();
			}
		}
		if (userPaddle.intersectsCircle(b)) {

			const d = userPaddleCenter - b.x;
			/*********************************** 
			if (computerPaddle.locked > 10) {
				b.reset();
				computerPaddle.unlock();
				return;
			}
			*/// RESSETTING IF STUCK NOT READY YET 
			wave.setPos(b.x, b.y + b.radius);
			wave.activate();
			userPaddle.lock(10);
			b.setY(userPaddle.y - b.doubleRadius);
			b.setDx(b.dx + d * -0.1);
			b.mirrorY();
		}
		if (computerPaddle.intersectsCircle(b)) {
			/*********************************** 
			if (computerPaddle.locked > 10) {
				b.reset();
				computerPaddle.unlock();
				return;
			}
			*/// RESSETTING IF STUCK NOT READY YET 
			const d = computerPaddleCenter - b.x;
			wave.setPos(b.x, b.y - b.radius);
			wave.activate();
			computerPaddle.lock(10);
			b.setY(computerPaddle.y + b.doubleRadius);
			b.setDx(b.dx + d * -0.1);
			b.mirrorY();
		}
		b.update(wave);
	};
	draw(ctx) {
		const { x, y, radius } = this;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2, false);
		ctx.lineWidth = 5;
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
		ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
		ctx.stroke();
		ctx.fill();
		return this;
	}
	regulateAcceleration() {
		const absDx = Math.abs(this.dx);
		const absDy = Math.abs(this.dy);
		const currentAcceleration = absDx + absDy;
		if (currentAcceleration < this.totalAcceleration) {
			if (absDx < absDy) {
				const k = this.totalAcceleration / currentAcceleration;
				this.dy *= k;
			}
		}
		else if (currentAcceleration > this.totalAcceleration) {
			if (absDx > absDy) {
				this.dx *= 0.9;
			}
			else {
				this.dy *= 0.9;
			}
		}
	}
	update(wave) {
		const dt = this.game.timeFrame / 2000;
		const accel = dt > 1 ? dt : 1;
		this.regulateAcceleration();

		this.x = this.x + (this.dx * accel);
		this.y = this.y + (this.dy * accel);

		if ((this.dx > 0) && (this.x > this.maxX)) {
			this.x = this.maxX;
			wave.setPos(this.x + this.radius, this.y);
			wave.activate();
			this.mirrorX();
		}
		else if ((this.dx < 0) && (this.x < this.minX)) {
			this.x = this.minX;
			wave.setPos(this.x - this.radius, this.y);
			wave.activate();
			this.mirrorX();
		}

		if ((this.dy > 0) && (this.y > this.maxY + this.radius * 4)) {
			this.y = this.maxY;
			this.mirrorY();
			this.mirrorX();
			this.reset();
			this.game.lose();
		}
		else if ((this.dy < 0) && (this.y < this.minY - this.radius * 4)) {
			this.y = this.minY;
			this.mirrorX();
			this.mirrorY();
			this.reset();
			this.game.goal();
		}
	}
	mirrorX() {
		this.dx = -this.dx;
	}
	mirrorY() {
		this.dy = -this.dy;
	}
	setDx(dx) {
		this.dx = dx;
	}
	reset() {
		this.x = this.centerX;
		this.y = this.centerY;
	}

	intersectsCircle(circle) {
		const pos = { x: this.x, y: this.y };
		const dist = getDistance(pos, circle);
		return dist - this.radius <= 0;
	}
	getDistance(circle) {
		const pos = { x: this.x, y: this.y };
		return getDistance(pos, circle);
	}
}