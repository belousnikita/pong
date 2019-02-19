import React from 'react';

import ReactDOM from 'react-dom';

import Background from 'bg-canvases';

import Dot from './figures/dot';

import Paddle from './figures/paddle';

import Keyholder from './controllers/keyholder';

import Canvas from './canvas';

import Starter from './starter';

import Description from './description';

import Controls from './controls';

import './styles/styles.css';

class Pong extends React.Component {

	constructor(props) {
		super(props);
		this.field = React.createRef();
		this.state = { width: 0, height: 0, move: false, isMobile: false, userPaddle: null, computerPaddle: null };
		this.bg = new Background();
		this.keyholder = new Keyholder();
		this.tick = this.tick.bind(this);
		this.updateFieldDimensions = this.updateFieldDimensions.bind(this);
		this.moveLeft = this.moveLeft.bind(this);
		this.moveRight = this.moveRight.bind(this);
		this.moveOnKeyPress = this.moveOnKeyPress.bind(this);
		this.moveSwitcher = this.moveSwitcher.bind(this);

	}
	updateDots(width, height) {
		const dotNetCreator = (i, params) => Dot.createNet(i, 2, params);

		if (width && height) {
			const params = Dot.calculateParams(2, width, height);

			this.bg.createLayer('dots', null,
				(i) => dotNetCreator(i, params), params.quantity,
				(c) => this.pointerActivity(c));


			this.bg.createLayer('paddles', null,
				(i) => Paddle.createPaddle(i, width, height, 25, 20), 2);

			const paddles = this.bg.getLayer('paddles');
			const userPaddle = paddles.getFigure('user');
			const computerPaddle = paddles.getFigure('computer');
			this.setState({ userPaddle, computerPaddle });
		}
	}
	componentDidMount() {
		setInterval(() => this.keyholder.holdEvents(this.moveOnKeyPress), 20);
		this.updateFieldDimensions();
		this.updateDots();
		requestAnimationFrame(this.tick);

	}
	updateFieldDimensions() {
		if (this.field) {
			const isMobile = window.innerWidth < 425;
			const width = this.field.current.clientWidth || 0;
			const height = this.field.current.clientHeight || 0;
			if (width !== this.state.width || height !== this.state.height) {
				this.updateDots(width, height);
				this.setState({ width, height, isMobile });
			}
		}
	}
	tick() {
		this.updateFieldDimensions();
		this.makeMove();
		this.bg.animate().draw();
		requestAnimationFrame(this.tick);
	}
	moveLeft() {
		const paddle = this.state.userPaddle;
		; if (paddle.x - paddle.width / 2 >= 0)
			paddle.moveLeft();
		else this.setState({ move: false });
	}
	moveRight() {
		const { width } = this.state;
		const paddle = this.state.userPaddle;
		if (paddle.x + paddle.width / 2 <= width)
			paddle.moveRight();
		else this.setState({ move: false });
	}
	moveOnKeyPress(keyCode) {
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
	makeMove() {
		const { left, right } = this.state;
		if (left && right) {
			return;
		} else {
			if (left) this.moveLeft();
			if (right) this.moveRight();
		}
	}
	moveSwitcher(direction, state) {
		this.setState({ [direction]: state });
	}
	pointerActivity(c) {
		const { userPaddle, computerPaddle } = this.state;
		if (userPaddle.intersectsCircle(c)
			|| computerPaddle.intersectsCircle(c))
			c.show();
		else
			c.hide();

	}
	render() {
		const { width, height, left, right, isMobile } = this.state;
		return (
			<div className="Pong" tabIndex="0" onKeyDown={(e) => this.keyholder.keyDown(e)}
				onKeyUp={(e) => this.keyholder.keyUp(e)}>
				{!isMobile && <Description />}
				<div className="field" id="field" ref={this.field}>
					<Starter width={width} height={height} />
					<Canvas width={width} height={height} bg={this.bg} updater={this.updateFieldDimensions} />
				</div>
				{isMobile && <Controls leftState={left} rightState={right} moveSwitcher={this.moveSwitcher} />}
			</div >
		);
	}
};

const rootElement = document.getElementById('root');
ReactDOM.render(<Pong />, rootElement);