import React from 'react';
import PropTypes from 'prop-types';

export default class Controls extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { moveRight, moveLeft } = this.props;
		return <div className="controls">
			<button type="button" className="left"
				onTouchStart={() => moveLeft()}
				onTouchEnd={(e) => console.log('end')}><i className="fas fa-arrow-left"></i>
			</button>
			<button type="button" className="rigth"
				onTouchStart={() => moveRight()}
				onTouchEnd={(e) => console.log('end')}><i className="fas fa-arrow-right"></i>
			</button>
		</div>;
	}

}
Controls.propTypes = {
	moveLeft: PropTypes.func,
	moveRight: PropTypes.func,
};