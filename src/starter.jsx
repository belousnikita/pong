import React from 'react';
import PropTypes from 'prop-types';
import './styles/description.css';
export default class Starter extends React.Component {
	render() {
		const { width, height, startGame } = this.props;
		const style = {
			width, height,
		};
		return <div className="starter" style={style}><p className="header start" onClick={() => startGame()}>Start</p></div>;
	}
}
Starter.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	startGame: PropTypes.func

};