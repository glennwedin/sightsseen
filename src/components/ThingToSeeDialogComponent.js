import React from "react";
import ReactDOM from "react-dom";
import tools from "../utils/tools";


let trans = tools.Transitions();

export default class ThingToSeeDialogComponent extends React.Component {

	constructor (props) {
		super(props);
		//this.state.currentPos = props.currentPos;
	}

	componentDidMount () {

	}

	closeDialog () {
		//To activate map-clicks again
		this.props.parent.activateMapClick();

		this.props.parent.setState({
			currentPos: null
		});
	}

	render () {
		let filebutton = "button";
		

		if(this.props.parent.state.file) {
			filebutton+=' ok';
		}

		//<input type="text" name="title" placeholder="Give it a title" />
		return (
			<div className="thingToSeeDialog">
				<div className="innerDialogWrapper">
					<div className="ion-close" onClick={this.closeDialog.bind(this)}></div>
					<div className="address">{this.props.currentPos.address}</div>
					<div className="flex-start">
						<div className={filebutton} onClick={this.props.parent.triggerFile.bind(this.props.parent)}>
							<div className="ion-image">
								<span className="smallerText">Select image</span>
							</div>
						</div>
						
						<input type="file" name="image" onChange={this.props.parent.fileready.bind(this.props.parent)} />
					</div>
					<div className="flex-bottom">
						<div className="button success" onClick={this.props.parent.save.bind(this.props.parent)}>
							<div className="ion-checkmark">
								<span className="smallerText">Save</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}