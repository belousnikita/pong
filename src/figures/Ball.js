import Dot from './Dot';

const getDistance = (pos1, pos2) =>
	Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2);

export default class extends Dot {
	constructor(x, y, radius, color = 'white', id) {
		super(x, y, radius, color);
		this.id = id;
	}
	draw(ctx) {
		const { x, y, radius, color } = this;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2, false);
		ctx.lineWidth = 5;
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
		ctx.stroke();
		return this;
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