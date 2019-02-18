export default class Paddle {
	constructor(x, y, width, height, playerId) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.speed = 5;
		this.playerId = playerId;
	}
	moveRight() {
		this.x = this.x + this.speed;
	}
	moveLeft() {
		this.x = this.x - this.speed;
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