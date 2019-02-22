export default class MovementController {
	static moveUserLeft() {
		const { userPaddle } = this.state;
		if (userPaddle.locked <= 0) {
			const { move } = this.state;
			if (userPaddle.x - userPaddle.width / 2 >= 0)
				userPaddle.moveLeft();
			else if (move) this.setState({ move: false });
		}
	}
	static moveUserRight() {
		const { userPaddle } = this.state;
		if (userPaddle.locked <= 0) {
			const { width, move } = this.state;
			if (userPaddle.x + userPaddle.width / 2 <= width)
				userPaddle.moveRight();
			else if (move) this.setState({ move: false });
		}
	}
	static moveComputerRight() {
		const { computerPaddle, width } = this.state;
		if (computerPaddle.locked <= 0) {
			if (computerPaddle.x + computerPaddle.width / 2 <= width)
				computerPaddle.moveRight();
		}
	}
	static moveComputerLeft() {
		const { computerPaddle } = this.state;
		if (computerPaddle.locked <= 0) {
			if (computerPaddle.x - computerPaddle.width / 2 >= 0)
				computerPaddle.moveLeft();
		}
	}
	static makeUserMove() {
		const { left, right } = this.state;
		if (left && right) {
			return;
		} else
		if (left) this.moveUserLeft();
		if (right) this.moveUserRight();
	}
}
