export default class Paddle {
	constructor(x, y, width, height, speed, id) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.speed = speed;
		this.id = id;
		this.locked = 0;
	}
	static createPaddle(i, fieldWidth, fieldHeight, margin, height) {
		const speed = fieldHeight * fieldWidth / 30000;
		if (i > 1) {
			return null;
		} else return i === 0 ? new Paddle(fieldWidth / 2, fieldHeight - margin, fieldWidth / 4, height, speed, 'user') :
			new Paddle(fieldWidth / 2, 0 + margin, fieldWidth / 4, height, speed, 'computer');
	}

	moveRight() {
		this.x = this.x + this.speed;
	}
	moveLeft() {
		this.x = this.x - this.speed;
	}
	lock(lockTime) {
		this.locked += lockTime;
	}
	tick() {
		if (this.locked > 0) {
			this.locked -= 1;
		}
	}
	unlock() {
		this.locked = 0;
	}
	intersectsCircle(circle) {
		const circleDistanceX = Math.abs(circle.x - this.x);
		const circleDistanceY = Math.abs(circle.y - this.y);

		if (circleDistanceX > (this.width / 2 + circle.radius)) { return false; }
		if (circleDistanceY > (this.height / 2 + circle.radius)) { return false; }

		if (circleDistanceX <= (this.width / 2)) { return true; }
		if (circleDistanceY <= (this.height / 2)) { return true; }

		const cornerDistance = ((circleDistanceX - this.width / 2) ** 2) +
			((circleDistanceY - this.height / 2) ** 2);

		return (cornerDistance <= (circle.radius ** 2));
	}
}