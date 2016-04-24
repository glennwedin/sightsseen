import React from "react";
import tools from "../utils/tools";

let trans = tools.Transitions();

export default class PointscreenComponent extends React.Component {

	constructor (props) {
		super(props);
		console.log(props)
		this.state = {
			currentPointId: props.selectedPoint._id,
			currentImage: null
		}
	}

	componentDidMount() {
		let th = this;
		trans.flipout('.pointscreen', {
			after: function (hammer) {
				th.props.parent.setState({
					selectedPoint: null
				});
			}
		});
	}

	componentDidUpdate(prevProps, prevState) {
		let th = this;
		trans.flipout('.pointscreen', {
			after: function (hammer) {
				th.props.parent.setState({
					selectedPoint: null
				});
			}
		});
	}

	closePointscreen () {
		this.props.parent.activateMapClick();
		this.props.parent.setState({
			selectedPoint: null
		});
	}

	addImage (e) {
		let file = e.target.files[0];
		let objectid = e.target.getAttribute('data-objectid');

		this.props.parent.setState({
			file: file
		}, () => {
			this.props.parent.save.call(this.props.parent, {pointid: objectid});
		});
	}

	openImage (e) {
		this.setState({
			currentImage: {
				id: e.target.getAttribute('data-id'),
				name: e.target.getAttribute('data-name')
			}
		});
	}

	closeImage () {
		this.setState({
			currentImage: null
		});
	}

	render () {
		let filebutton = "button";

		if(this.props.parent.state.file) {
			filebutton+=' ok';
		}

		let renderImages = (obj, i) => {
			let style = {
				backgroundImage: 'url(/uploads/point-'+this.state.currentPointId+'/small-'+obj.name+')'
			}
			return <div onClick={this.openImage.bind(this)} className="image" data-id={obj._id} data-name={obj.name} key={obj._id} style={style}></div>
		}

		let imageview = "";
		if(this.state.currentImage) {
			let style = {
				backgroundImage: 'url(/uploads/point-'+this.state.currentPointId+'/standard-'+this.state.currentImage.name+')'
			}
			imageview = (
				<div className="imageview" style={style}>
					<div className="ion-close" onClick={this.closeImage.bind(this)}></div>
				</div>
			);
		}


		return (
			<div>
				{imageview}
				<div className="pointscreen">
					<div className="images">
						{this.props.parent.state.selectedPoint.images.map(renderImages)}
					</div>
					<div className="add" onClick={this.props.parent.triggerFile.bind(this.props.parent)}>
						<div className="ion-plus"></div>
						<input type="file" name="image" data-objectid={this.props.parent.state.selectedPoint._id} onChange={this.addImage.bind(this)} />
					</div>
				</div>
			</div>
		)
	}

}