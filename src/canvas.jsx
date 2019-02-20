import React from 'react';
import PropTypes from 'prop-types';
import setupCanvas from './controllers/canvasDpi';
import './styles/styles.css';

class Canvas extends React.Component {

	constructor(props) {
		super(props);
		this.ref = React.createRef();
		this.upper = React.createRef();
		const { width, height } = props;
		this.state = {
			width, height
		};
	}

	componentDidUpdate() {
		const canvas = this.ref.current;
		const upper = this.upper.current;
		const upperContext = upper.getContext('2d');
		upperContext.rect(20, 20, 150, 100);
		upperContext.stroke();
		const ctx = setupCanvas(canvas);
		const { bg } = this.props;
		if (bg) {
			bg.setContext(ctx, 'dots');
			bg.setContext(ctx, 'paddles');
			bg.getLayer('paddles').hide();
			bg.setContext(ctx, 'ballLayer');
			bg.setContext(upperContext, 'waveLayer');
		}
	}
	render() {
		const { width, height } = this.props;
		return (<div>
			<canvas ref={this.ref} width={width} height={height} />
			<canvas className="upper" ref={this.upper} width={width} height={height} />
		</div>
		);
	}
}
Canvas.propTypes = {
	bg: PropTypes.any,
	width: PropTypes.number,
	height: PropTypes.number,
	updater: PropTypes.any,
};
export default Canvas;