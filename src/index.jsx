import React from 'react';
import ReactDOM from 'react-dom';
import Background from 'bg-canvases';
import Dot from './objects/Dot';
import Ball from './objects/Ball';
import Wave from './objects/Wave';
import Paddle from './objects/Paddle';
import KeypressController from './controllers/KeypressController';
import MovementController from './controllers/MovementController';
import GameController from './controllers/GameController';
import Canvas from './canvas';
import Starter from './starter';
import Description from './description';
import Controls from './controls';
import classNames from 'classnames';
import './styles/styles.css';
import Scores from './scores';

class Pong extends React.Component {

	constructor(props) {
		super(props);
		this.field = React.createRef();
		this.state = {
			width: 0,
			height: 0,
			move: false,
			isMobile: false,
			userPaddle: null,
			computerPaddle: null,
			ball: null,
			wave: null,
			userScore: 0,
			computerScore: 0,
		};
		this.bg = new Background();
		this.blurredBg = new Background(); // TODO: Fix bg-canvases
		this.staticBg = new Background();
		this.keyholder = new KeypressController();
		this.game = new GameController();
		this.tick = this.tick.bind(this);
		this.updateFieldDimensions = this.updateFieldDimensions.bind(this);
		this.waveActivity = Dot.waveActivity.bind(this);
		this.pointerActivity = Dot.pointerActivity.bind(this);
		this.ballActivity = Ball.ballActivity.bind(this);
		this.moveUserLeft = MovementController.moveUserLeft.bind(this);
		this.moveUserRight = MovementController.moveUserRight.bind(this);
		this.makeUserMove = MovementController.makeUserMove.bind(this);
		this.moveComputerLeft = MovementController.moveComputerLeft.bind(this);
		this.moveComputerRight = MovementController.moveComputerRight.bind(this);
		this.moveOnKeyPress = KeypressController.moveOnKeyPress.bind(this);
		this.moveSwitcher = this.moveSwitcher.bind(this);
		this.startGame = this.startGame.bind(this);
	}

	updateDots(width, height) {
		const blurredRadius = this.state.isMobile ? 18 : 20;
		const dotNetCreator = (i, params) => Dot.createNet(i, 2, params);
		const blurredDotNetCreator = (i, params) => Dot.createNet(i, blurredRadius, params);
		if (width && height) {

			// Base dot net params
			const baseParams = Dot.calculateParams(2, width, height);

			// Blurred dot net params
			const blurredParams = Dot.calculateParams(blurredRadius, width, height);
			// TODO: Fif bgcanvases: Cannot hide layer with no ctx; 

			//  Base dot net
			this.bg.createLayer('dots', null,
				(i) => dotNetCreator(i, baseParams), baseParams.quantity,
				(c) => this.pointerActivity(c));
			// Blurred dot net TODO: Fix independent background instance, bg-canvases dont'do proper layer clearing
			this.blurredBg.createLayer('backDots', null,
				(i) => blurredDotNetCreator(i, blurredParams), blurredParams.quantity).applyOnEach((c) => c.setAlpha(0.08));
			this.blurredBg.createLayer('blurredDots', null,
				(i) => blurredDotNetCreator(i, blurredParams), blurredParams.quantity,
				(c) => this.waveActivity(c));
			// Paddles layer
			this.bg.createLayer('paddles', null,
				(i) => Paddle.createPaddle(i, width, height, 4, 20), 2);
			// Ball layer

			this.bg.createLayer('ballLayer', null,
				() => new Ball(this.game, width, height, width / 50, 'ball'), 1, (b) => this.ballActivity(b));
			// Wave effect layer
			this.bg.createLayer('waveLayer', null,
				() => new Wave(width / 2, height / 2, 25, width / 5, 'wave'), 1,
				(w) => Wave.animation(w));

			// Objects
			const paddles = this.bg.getLayer('paddles');
			const userPaddle = paddles.getFigure('user');
			const computerPaddle = paddles.getFigure('computer');
			const ball = this.bg.getFigure('ballLayer', 'ball');
			const wave = this.bg.getFigure('waveLayer', 'wave');
			this.setState({ userPaddle, computerPaddle, ball, wave });
		}
	}
	updateScore(userScoreUpdated, computerScoreUpdated) {
		const { userScore, computerScore } = this.state;
		if (userScoreUpdated !== userScore || computerScoreUpdated !== computerScore)
			this.setState({ userScore: userScoreUpdated, computerScore: computerScoreUpdated });
	}
	componentDidMount() {
		setInterval(() => this.keyholder.holdEvents(this.moveOnKeyPress), 20);
		this.updateFieldDimensions();
		this.updateDots();
		this.setState({ score: this.game.score });
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
		const { computerPaddle, userPaddle, isStarted } = this.state;
		const { score } = this.game;
		this.updateScore(score.userScore, score.computerScore);
		this.updateFieldDimensions();
		if (isStarted) {
			this.makeUserMove();
			this.bg.animate().draw();
			this.blurredBg.animate().draw();
			this.game.tick();
			computerPaddle.tick();
			userPaddle.tick();
		}
		requestAnimationFrame(this.tick);
	}

	moveSwitcher(direction, state) {
		this.setState({ [direction]: state });
	}

	startGame() {
		this.game.start();
		this.setState({ isStarted: true });
	}
	render() {
		const { width, height, left, right, isMobile, userScore, computerScore, isStarted } = this.state;
		const backgroundClass = classNames('background', {
			started: isStarted
		});
		return (
			<div className="pong" tabIndex="0" onKeyDown={(e) => this.keyholder.keyDown(e)}
				onKeyUp={(e) => this.keyholder.keyUp(e)}>
				<div className={backgroundClass} />
				{!isMobile && <Description />}
				{!isMobile && <Scores userScore={userScore} computerScore={computerScore} />}
				<div className="field" ref={this.field}>
					{!isStarted && <Starter width={width} height={height} startGame={this.startGame} />}
					<Canvas width={width}
						height={height}
						bg={this.bg}
						blurredBg={this.blurredBg}
						updater={this.updateFieldDimensions} />
				</div>
				{isMobile && <Controls leftState={left} rightState={right} moveSwitcher={this.moveSwitcher}>
					<Scores userScore={userScore} computerScore={computerScore} />
				</Controls>}
			</div >
		);
	}
};

const rootElement = document.getElementById('root');
ReactDOM.render(<Pong />, rootElement);