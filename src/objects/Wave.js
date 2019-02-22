
const getDistance = (pos1, pos2) =>
	Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2);

export default class Wave {
	constructor(x, y, width, maxRadius, id) {
		this.x = x;
		this.y = y;
		this.radius = 0;
		this.width = width;
		this.margin = - width;
		this.maxRadius = maxRadius;
		this.id = id;
		this.visible = false;
		this.active = false;
	}
	increaseRadius() {
		this.radius += 2;
		this.margin += 3.2;
	}
	static animation(w) {
		if (w.active) {
			w.increaseRadius();
			if (w.radius > w.maxRadius) {
				w.stop();
				w.resetRadius();
			}
		}
	}
	resetRadius() {
		this.radius = 0;
		this.margin = -this.width;
	}
	stop() {
		this.active = false;
	}
	activate() {
		this.active = true;
	}
	setPos(x, y) {
		this.resetRadius();
		this.x = x;
		this.y = y;
	}
	intersectsCircle(circle) {
		const pos = { x: this.x, y: this.y };
		const dist = getDistance(pos, circle);
		return dist - this.radius <= 0 && dist > this.margin;
	}
}