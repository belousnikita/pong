import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './styles/controls.css';

export default class Controls extends React.Component {
	render() {
		const { moveSwitcher, leftState, rightState } = this.props;
		const leftClass = classNames('left', { active: leftState });
		const rightClass = classNames('right', { active: rightState });
		return <div className="controls">
			<button type="button" className={leftClass}
				onTouchStart={() => moveSwitcher('left', true)}
				onTouchMove={() => moveSwitcher('left', true)}
				onMouseDown={() => moveSwitcher('left', true)}
				onMouseUp={() => moveSwitcher('left', false)}
				onTouchEnd={() => moveSwitcher('left', false)}><i className="fas fa-arrow-left"></i>
			</button>
			{this.props.children}
			<button type="button" className={rightClass}
				onTouchStart={() => moveSwitcher('right', true)}
				onTouchMove={() => moveSwitcher('right', true)}
				onMouseDown={() => moveSwitcher('right', true)}
				onMouseUp={() => moveSwitcher('right', false)}
				onTouchEnd={() => moveSwitcher('right', false)}><i className="fas fa-arrow-right"></i>
			</button>
		</div>;
	}

}
Controls.propTypes = {
	leftState: PropTypes.bool,
	rightState: PropTypes.bool,
	moveSwitcher: PropTypes.func,
	children: PropTypes.node.isRequired
};