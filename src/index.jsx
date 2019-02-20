import React from 'react';

import ReactDOM from 'react-dom';

import Background from 'bg-canvases';

import Dot from './figures/Dot';

import Paddle from './figures/Paddle';

import Keyholder from './controllers/keyholder';

import Canvas from './canvas';

import Starter from './starter';

import Description from './description';

import Controls from './controls';

import classNames from 'classnames';

import './styles/styles.css';
import Ball from './figures/Ball';
import Wave from './figures/Wave';

class Pong extends React.Component {

	constructor(props) {
		super(props);
		this.field = React.createRef();
		this.state = {
			width: 0,
			height: 0,
			move: false,
			isMobile: false,
			isStarted: false,
			userPaddle: null,
			computerPaddle: null,
			ball: null,
			wave: null,
		};
		this.bg = new Background();
		this.keyholder = new Keyholder();
		this.tick = this.tick.bind(this);
		this.updateFieldDimensions = this.updateFieldDimensions.bind(this);
		this.pointerActivity = Dot.pointerActivity.bind(this);
		this.moveLeft = Paddle.moveLeft.bind(this);
		this.moveRight = Paddle.moveRight.bind(this);
		this.moveOnKeyPress = this.moveOnKeyPress.bind(this);
		this.moveSwitcher = this.moveSwitcher.bind(this);
		this.startGame = this.startGame.bind(this);

	}
	updateDots(width, height) {
		const dotNetCreator = (i, params) => Dot.createNet(i, 2, params);

		if (width && height) {
			const params = Dot.calculateParams(2, width, height);
			// TODO: Fif bgcanvases: Cannot hide layer with no ctx; 
			// Create blurred wave effects
			this.bg.createLayer('dots', null,
				(i) => dotNetCreator(i, params), params.quantity,
				(c) => this.pointerActivity(c));
			this.bg.createLayer('paddles', null,
				(i) => Paddle.createPaddle(i, width, height, 25, 20), 2);
			this.bg.createLayer('ballLayer', null,
				() => new Ball(width / 2, height / 2, 25, 'white', 'ball'));
			this.bg.createLayer('waveLayer', null, () => new Wave(width / 2, height / 2, 25, width / 2, 'wave'), 1, (w) => Wave.animation(w));
			const paddles = this.bg.getLayer('paddles');
			const userPaddle = paddles.getFigure('user');
			const computerPaddle = paddles.getFigure('computer');
			const ball = this.bg.getFigure('ballLayer', 'ball');
			const wave = this.bg.getFigure('waveLayer', 'wave');
			this.setState({ userPaddle, computerPaddle, ball, wave });
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
			const width = this.field.current.clientWidth || 0;
			const height = this.field.current.clientHeight || 0;
			const isMobile = width < 425;
			if (width !== this.state.width || height !== this.state.height) {
				this.updateDots(width, height);
				this.setState({ width, height, isMobile });
			}
		}
	}
	tick() {
		const { isStarted } = this.state;
		this.updateFieldDimensions();
		if (isStarted) {
			this.makeMove();
			this.bg.animate().draw();
		}
		requestAnimationFrame(this.tick);
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

	startGame() {
		this.setState({ isStarted: true });
	}
	render() {
		const { width, height, left, right, isMobile, isStarted } = this.state;
		const backgroundClass = classNames('background', {
			started: isStarted
		});
		return (
			<div className="pong" tabIndex="0" onKeyDown={(e) => this.keyholder.keyDown(e)}
				onKeyUp={(e) => this.keyholder.keyUp(e)}>
				<div className={backgroundClass} />
				{!isMobile && <Description />}
				<div className="field" id="field" ref={this.field}>
					{!isStarted && <Starter width={width} height={height} startGame={this.startGame} />}
					<Canvas width={width} height={height} bg={this.bg} updater={this.updateFieldDimensions} />
				</div>
				{isMobile && <Controls leftState={left} rightState={right} moveSwitcher={this.moveSwitcher} />}
			</div >
		);
	}
};

const rootElement = document.getElementById('root');
ReactDOM.render(<Pong />, rootElement);