const getIndexes = (iter, wCount, hCount) => {
	const currentRow = (iter / wCount) % 1 === 0 ? (iter / wCount) : Math.ceil(iter / wCount) - 1;
	const i = iter + 1 > wCount ? currentRow : 0;
	const total = wCount * (i + 1);
	const totalRow = wCount >= hCount ? wCount : hCount;
	const d = wCount > hCount ? 1 : 0;
	const j = i > 0 ? totalRow - (total - iter + d + (wCount < hCount ? hCount - wCount : -(wCount - hCount))) : iter;
	return { i, j };
};
export default class Dot {
	constructor(x, y, radius, color = 'white') {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.visible = true;
	}
	static calculateParams(radius, fieldWidth, fieldHeigth) {
		const pureWCount = fieldWidth / (radius * 2);
		const wCount = Math.floor(pureWCount);
		const pureHCount = fieldHeigth / (radius * 2);
		const hCount = Math.floor(pureHCount);
		return {
			pureWCount, pureHCount, wCount, hCount, quantity: hCount * wCount
		};
	}
	static createNet(iter, radius, params) {
		const { hCount, wCount, pureWCount } = params;
		const { i, j } = getIndexes(iter, wCount, hCount);
		if (i % 2 === 0 ? j % 2 === 0 : j % 2 !== 0) {
			const x = (pureWCount - wCount) * radius + radius + (radius * 2 * (j));
			const y = radius + (i * radius * 2);
			return new Dot(x, y, radius);
		}
		else return null;
	}
	draw(ctx) {
		const { x, y, radius, color } = this;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2, false);
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.stroke();
		ctx.fill();
		return this;
	}
	setRadius(radius) {
		this.radius = radius;
		return this;
	}
	setX(x) {
		this.x = x;
		return this;
	}
	setY(y) {
		this.y = y;
		return this;
	}
	setColor(color) {
		this.color = color;
		return this;
	}
	hide() {
		this.visible = false;
		return this;
	}
	show() {
		this.visible = true;
		return this;
	}
}
