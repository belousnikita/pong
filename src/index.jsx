import React from 'react';

import ReactDOM from 'react-dom';

import Background from 'bg-canvases';

import Dot from './figures/dot';

import Paddle from './figures/paddle';

import Keyholder from './controllers/keyholder';

import Canvas from './canvas';

import Controls from './controls';

import './styles/styles.css';

const pointerActivity = (bg) => (c) => {
	const layer = bg.getLayer('paddle');
	const paddle = layer.figures[0];
	if (paddle.intersectsCircle(c)) {
		c.show();
		return;
	} else {
		c.hide();
		return;
	}
};
class Pong extends React.Component {

	constructor(props) {
		super(props);
		this.field = React.createRef();
		this.state = { width: 0, height: 0 };
		this.bg = new Background();
		this.keyholder = new Keyholder();
		this.tick = this.tick.bind(this);
		this.updateFieldDimensions = this.updateFieldDimensions.bind(this);
		this.moveLeft = this.moveLeft.bind(this);
		this.moveRight = this.moveRight.bind(this);
		this.moveKey = this.moveKey.bind(this);
	}
	updateDots(width, height) {
		if (width && height) {
			const params = Dot.calculateParams(2, width, height);
			this.bg.createLayer('dots', null, (i) => Dot.createNet(i, 2, params), params.quantity, pointerActivity(this.bg));
			this.bg.createLayer('paddle', null, () => new Paddle(width / 2, height - 25, width / 4, 20), 1);
		}
	}
	componentDidMount() {
		setInterval(() => this.keyholder.holdEvents(this.moveKey), 20);
		this.updateFieldDimensions();
		this.updateDots();
		requestAnimationFrame(this.tick);

	}
	updateFieldDimensions() {
		if (this.field) {
			const width = this.field.current.clientWidth || 0;
			const height = this.field.current.clientHeight || 0;
			if (width !== this.state.width || height !== this.state.height) {
				this.updateDots(width, height);
				this.setState({ width, height });
			}
		}
	}
	tick() {
		this.updateFieldDimensions();
		this.bg.animate().draw();
		requestAnimationFrame(this.tick);
	}
	moveLeft() {
		const paddle = this.bg.getLayer('paddle').figures[0];
		if (paddle.x - paddle.width / 2 >= 0)
			paddle.moveLeft();
	}
	moveRight() {
		const { width } = this.state;
		const paddle = this.bg.getLayer('paddle').figures[0];
		if (paddle.x + paddle.width / 2 <= width)
			paddle.moveRight();
	}
	moveKey(keyCode) {
		if (keyCode === '65' || keyCode === '37') {
			this.moveLeft();
			return;
		}
		if (keyCode === '68' || keyCode === '39') {
			this.moveRight();
			return;
		}
		return;
	}
	render() {
		const { width, height } = this.state;
		return (
			<div className="Pong" tabIndex="0" onKeyDown={(e) => this.keyholder.keyDown(e)}
				onKeyUp={(e) => this.keyholder.keyUp(e)}>
				<div className="field" id="field" ref={this.field}>
					<Canvas width={width} height={height} bg={this.bg} updater={this.updateFieldDimensions} />
				</div>
				<Controls moveLeft={this.moveLeft} moveRight={this.moveRight} />
			</div >
		);
	}
};

const rootElement = document.getElementById('root');
ReactDOM.render(<Pong />, rootElement);