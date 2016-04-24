import React from "react";

export default class LoadscreenComponent extends React.Component {

	constructor () {
		super();

		this.state = {
			loading: false,
			progress: 0
		}
	}

	render () {
		let style = {
			width: this.state.progress
		}
		return (<div className={lscreen}>
					<div className="text">Loading. . .</div>
					<div className="progressbar" style={style}></div>
				</div>);
	}
}