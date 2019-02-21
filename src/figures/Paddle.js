export default class Paddle {
	constructor(x, y, width, height, speed, id) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.speed = speed;
		this.id = id;
	}
	static createPaddle(i, fieldWidth, fieldHeight, margin, height) {
		const speed = fieldHeight * fieldWidth / 20000;
		if (i > 1) {
			return null;
		} else return i === 0 ? new Paddle(fieldWidth / 2, fieldHeight - margin, fieldWidth / 4, height, speed, 'user') :
			new Paddle(fieldWidth / 2, 0 + margin, fieldWidth / 4, height, speed, 'computer');
	}
	static moveLeft() {
		const { move } = this.state;
		const paddle = this.state.userPaddle;
		if (paddle.x - paddle.width / 2 >= 0)
			paddle.moveLeft();
		else if (move) this.setState({ move: false });
	}
	static moveRight() {
		const { width, move } = this.state;
		const paddle = this.state.userPaddle;
		if (paddle.x + paddle.width / 2 <= width)
			paddle.moveRight();
		else if (move) this.setState({ move: false });
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