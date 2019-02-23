import React from 'react';
import PropTypes from 'prop-types';

import './styles/description.css';
export default class Scores extends React.Component {
	render() {
		const { userScore, computerScore } = this.props;
		return <div className="scores">
			<p className="scoredigit">{computerScore}</p>
			<p className="scoredigit">-</p>
			<p className="scoredigit">{userScore}</p>
		</div>;
	}
}
Scores.propTypes = {
	userScore: PropTypes.number,
	computerScore: PropTypes.number,
};