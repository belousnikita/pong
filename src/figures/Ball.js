import Dot from './Dot';

const getDistance = (pos1, pos2) =>
	Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2);

export default class extends Dot {
	constructor(game, fieldWidth, fieldHeight, radius, id) {
		super(fieldWidth / 2, fieldHeight / 2, radius, 'white');
		this.centerX = fieldWidth / 2;
		this.centerY = fieldHeight / 2;
		this.game = game;
		this.maxX = fieldWidth - radius;
		this.maxY = fieldHeight - radius;
		this.minX = radius;
		this.minY = radius;
		this.speed = 1;
		this.maxD = 5;
		this.dx = this.speed + (game.random(2, 2) * game.randomDirection());
		this.dy = this.speed + (game.random(5, 5) * game.randomDirection());
		this.acceleration = 0;
		this.id = id;
	}
	static ballActivity(b) {
		const { userPaddle, computerPaddle } = this.state;
		b.update();
		const oneThird = userPaddle.width / 4;
		if (userPaddle.intersectsCircle(b)) {
			if (b.x >= userPaddle.x + oneThird) {
				b.setDx(Math.abs(b.dx * 1.2 + Math.random() - 0.5));

			}
			else if (b.x <= userPaddle.x - oneThird) {
				b.setDx(-Math.abs(b.dx * 1.2 + Math.random() - 0.5));

			}
			else {
				b.setDx(b.dx * 0.8 + Math.random() - 0.5);

			}
			b.setY(userPaddle.y - userPaddle.height - b.radius);
			b.mirrorY();
		}
		if (computerPaddle.intersectsCircle(b)) {
			if (b.x >= computerPaddle.x + oneThird) {
				b.setDx(Math.abs(b.dx * 1.3 + Math.random() - 0.5));
			}
			else if (b.x <= computerPaddle.x - oneThird) {
				b.setDx(-Math.abs(b.dx * 1.3 * + Math.random() - 0.5));
			}
			else {
				b.setDx(b.dx * 0.8 + Math.random() - 0.5);
			}
			b.setY(computerPaddle.y + computerPaddle.height + b.radius);
			b.mirrorY();

		}
	};
	draw(ctx) {
		const { x, y, radius } = this;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2, false);
		ctx.lineWidth = 5;
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
		ctx.stroke();
		return this;
	}
	update() {
		const dt = this.game.timeFrame / 2000;
		const accel = dt > 1 ? dt : 1;
		this.x = this.x + (this.dx * accel);
		this.y = this.y + (this.dy * accel);

		if ((this.dx > 0) && (this.x > this.maxX)) {
			this.x = this.maxX;
			this.mirrorX();
		}
		else if ((this.dx < 0) && (this.x < this.minX)) {
			this.x = this.minX;
			this.mirrorX();
		}

		if ((this.dy > 0) && (this.y > this.maxY + this.radius * 4)) {
			this.y = this.maxY;
			console.log('compGoal');
			this.mirrorY();
			this.mirrorX();
			this.reset();
			this.game.lose();
		}
		else if ((this.dy < 0) && (this.y < this.minY - this.radius * 4)) {
			this.y = this.minY;
			console.log('userGoal');
			this.mirrorX();
			this.mirrorY();
			this.reset();
		}
	}
	mirrorX() {
		this.dx = -this.dx;
	}
	mirrorY() {
		this.dy = -this.dy;
	}
	setDx(dx) {
		this.dx = this.maxD > dx ? dx : this.maxD;
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