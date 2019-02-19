import React from 'react';

import './styles/description.css';
export default class Description extends React.Component {
	render() {
		return <div className="description">
			<h1 className="header">Pong</h1>
			<p className="ctrl">Controls:</p>
			<p className="desc"><i className="fas fa-arrow-left"></i>, A — Move left</p>
			<p className="desc"><i className="fas fa-arrow-right"></i>, D — Move right</p>
		</div>;
	}
}