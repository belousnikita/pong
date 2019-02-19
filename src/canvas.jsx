import React from 'react';
import PropTypes from 'prop-types';
import setupCanvas from './controllers/canvasDpi';
import './styles/styles.css';

class Canvas extends React.Component {

	constructor(props) {
		super(props);
		this.ref = React.createRef();
		const { width, height } = props;
		this.state = {
			width, height
		};
	}

	componentDidUpdate() {
		const canvas = this.ref.current;
		const ctx = setupCanvas(canvas);
		const { bg } = this.props;
		if (bg) {
			bg.setContext(ctx, 'dots');
			bg.setContext(ctx, 'paddles');
			bg.getLayer('paddles').hide();
		}
	}
	render() {
		const { width, height } = this.props;
		return (
			<canvas ref={this.ref} width={width} height={height} />
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