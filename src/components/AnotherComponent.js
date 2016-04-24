import React from "react";

export default class AnotherComponent extends React.Component {

	constructor () {
		super();
	}

	clickMe () {
		alert('test');
	}

	render () {
		return (<div>
				<h1>Another component</h1>
				<p>This one has no child components</p>
				<a href="" onClick={this.clickMe}>Click on me</a>
				</div>);
	}
}