import React from "react";
import Pointscreen from "./PointscreenComponent";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import tools from "../utils/tools";

//TODO:
// All adding of markers should use this.addMarkers

//This module does too much

export default class MapComponent extends React.Component {

	constructor () {
		super();
		this.state = {
			map: null,
			marker: null,
			currentPos: null,
			loading: true,
			loadProgress: 0,
			file: null,
			existingMarkers: [],
			selectedPoint: null
		}
	}

	addNearbyPoints () {

		let th = this,
		pos = {lat: this.state.currentPos.lat, lng: this.state.currentPos.lng},
		mi = {
				  url: '/img/ios7-location-user.png',
				  size: new google.maps.Size(512, 512),
				  origin: new google.maps.Point(0, 0),
				  anchor: new google.maps.Point(25, 45),
				  scaledSize: new google.maps.Size(50, 50)
				}

				console.log('addnearby', pos)
				let marker = new google.maps.Marker({
					position: pos,
					icon: mi
				});
				//marker.setMap(map);

				//Find registered locations near user
				let xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function () {
					if(xhr.readyState === 4 && xhr.status === 200) {
						let json = JSON.parse(xhr.responseText);

						//REUSE MAP ELEMENTS GOSH DANGIT
						let mi = {
							url: '/img/ios7-location.png',
						 	size: new google.maps.Size(512, 512),
							origin: new google.maps.Point(0, 0),
							anchor: new google.maps.Point(12, 30),
							scaledSize: new google.maps.Size(50, 50)
						}

						let markers = json.map(function (obj, i) {
							let marker = new google.maps.Marker({
								position: { lat: obj.point.coordinates[1], lng: obj.point.coordinates[0] },
								icon: mi
							});
							marker.addListener('click', methods.markerClick.bind(obj, function (json) {
								th.setState({
									selectedPoint: json
								});
							}));
							return marker;
						});

						th.setState({
							marker: marker,
							existingMarkers: markers,
							loading: false
						});
					}
				};
				xhr.open('POST', '/api/nearbypoints');
				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhr.send("lat="+pos.lat+"&lng="+pos.lng);
	}

	componentDidMount () {
		/*
			Set up dragevent
		*/
		let th = this;
		//alert('hei');

		let map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: -34.397, lng: 150.644},
			zoom: 8
		});

		th.setState({
			map: map
		}, () => {
			th.state.map.addListener('click', methods.mapClick.bind(th))
		});

		if("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(function(position) {
				let pos = {lat: position.coords.latitude, lng: position.coords.longitude};
					th.state.map.setCenter(pos);
					th.state.map.setZoom(15);
					methods.geocode.call(th, pos);
			}, function (error) {
				alert(error.message);
			});
		} else {
			alert('Geolocation not available on your device');
		}
	}

	//DO CLEANUP AND READDING HERE
	componentDidUpdate(prevProps, prevState) {
		if(prevState.loadProgress !== this.state.loadProgress) {
			//do nothing

		} else {
			if(prevState.marker) {
				prevState.marker.setMap(null);
			}
			if(this.state.marker) {
				this.state.marker.setMap(this.state.map);
			}
			if(prevState.existingMarkers.length > 0) {
				prevState.existingMarkers.forEach((obj, i) => {
					obj.setMap(null);
				});
			}
			if(this.state.existingMarkers.length > 0) {
				this.state.existingMarkers.forEach((obj, i) => {
					obj.setMap(this.state.map);
				});
			}
		}
 	}

	triggerFile () {
		let file = document.querySelector('input[type="file"]');
		let evt = new MouseEvent('click');
		file.dispatchEvent(evt);
	}

	openDialog () {
		var dialog = document.querySelector('.thingToSeeDialog');
		dialog.classList.add('visible');
	}

	closeDialog () {
		var dialog = document.querySelector('.thingToSeeDialog');
		dialog.classList.remove('visible');
		//this.state.map.addListener('click', methods.mapClick.bind(this));
	}

	activateMapClick () {
		this.state.map.addListener('click', methods.mapClick.bind(this));
	}

	//Deprecated
	fileready (e) {
		var file = e.target.files[0];
		this.setState({
			file: file
		});
	}

	addMarker (obj) {
		let mi = {
			url: '/img/ios7-location-user.png',
			size: new google.maps.Size(512, 512),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(25, 45),
			scaledSize: new google.maps.Size(50, 50)
		}

		let marker = new google.maps.Marker({
			position: { lat: obj.point.coordinates[1], lng: obj.point.coordinates[0] },
			icon: mi
		});
		marker.addListener('click', methods.markerClick.bind(obj, (json) => {
			this.setState({
				selectedPoint: json
			});
		}));
		return marker;
	}

	//replaces fileready
	change (e) {
		let file = e.target.files[0];
		this.setState({
			file: file
		}, () => {
			console.log('save');
			this.save();
		});
	}

	save (objectid) {
		
		this.setState({loading:true});
		let file = this.state.file,
		th = this;
		//let name = document.querySelector('input[name="title"]').value;

		if(!file) {
			alert('No image selected');
			this.setState({
				file: null,
				loading: false
			});
		} else {
			let data = new FormData();
			let url = '/api/point';
			data.append('file', file);

			if(objectid && objectid.pointid) {
				url = '/api/point/'+objectid.pointid;
			} else {
				if(this.state.currentPos) {
					data.append('title', this.state.currentPos.address);
					data.append('place_id', this.state.currentPos.id);
					data.append('lat', this.state.currentPos.lat);
					data.append('lng', this.state.currentPos.lng);
				}
			}
			let xhr = new XMLHttpRequest();
			xhr.onreadystatechange = () => {
				if(xhr.readyState === 4 && xhr.status === 200) {
					let res = JSON.parse(xhr.responseText);

					let markers = this.state.existingMarkers;
					if(this.state.currentPos) {
						let newmarker = this.addMarker({
							_id: res._id, 
							point: {
								coordinates: [
									this.state.currentPos.lng, 
									this.state.currentPos.lat
								]
							}
						});
						markers.push(newmarker);
					}
					this.setState({
						loading:false, 
						currentPos: null, 
						selectedPoint: null, 
						loadProgress: 0,
						existingMarkers: markers}, () => {
							//this.activateMapClick();
					});
				}
			}
			xhr.upload.onprogress = function (evt) {
				if(evt.lengthComputable) {
					let progress = (evt.loaded/evt.total)*100;
					//console.log(progress);
					th.setState({
						loadProgress: progress
					});
				}
			}
			xhr.open('POST', url);
			xhr.send(data);
		}
	}

	render () {
		let lscreen = "loadscreen",
			loadbar = "";
		if(this.state.loading) {
			lscreen = 'loadscreen visible';
		}
		if(this.state.loadProgress > 0) {
			loadbar = <div className="loadbar">
						<div style={{width: this.state.loadProgress+'%'}}></div>
						</div>;
		}

		let pointscreen = "";
		console.log('Selected point', this.state.selectedPoint);
		if(this.state.selectedPoint) {
			pointscreen = <Pointscreen selectedPoint={this.state.selectedPoint} parent={this} />
		}
		

		return (
			<div id="mainwrapper">
				<div className={lscreen} data-progress={this.state.loadProgress}>
					<div className="text">Loading. . .</div>
					{loadbar}
				</div>
					{pointscreen}
				<div className="top">
					<div className="ion-android-locate">
						<div>SEEN</div>
					</div>
				</div>
					
				<div className="add" onClick={this.triggerFile.bind(this)} >
					<div className="ion-plus"></div>
					<input type="file" name="image" onChange={this.change.bind(this)} />
				</div>

				<div id="map">
				</div>
			</div>
		);
	}
}

const methods = {
	geocode: function (pos) {
		var th = this;
		let geocoder = new google.maps.Geocoder;
		console.log('geocode', pos);
		geocoder.geocode({'location': pos}, function(results, status) {
		    if (status === google.maps.GeocoderStatus.OK) {
		    	if (results[0]) {
		    		th.setState({
		    			loading: false,
		    			currentPos: {
		    				address: results[0].formatted_address,
		    				id: results[0].place_id,
		    				lat: pos.lat,
		    				lng: pos.lng
		    			}
		    		}, () => {
		    			th.addNearbyPoints();
		    		});
		    	} else {
		    		window.alert('No results found');
		    	}
		    } else {
		    	window.alert('Geocoder failed due to: ' + status);
		    }
		});
	},

	mapClick: function (evt) {
		
		let mi = {
			url: '/img/ios7-location-user.png',
			size: new google.maps.Size(512, 512),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(25, 45),
			scaledSize: new google.maps.Size(50, 50)
		}

		let marker = new google.maps.Marker({
			position: evt.latLng,
			icon: mi
		});
		
		this.setState({
			marker: marker,
			loading: true,
			currentPos: {
		    	address: null,
		    	id: null,
		    	lat: evt.latLng.lat(),
		    	lng: evt.latLng.lng()
		    }
		}, () => {
			methods.geocode.call(this, {lat:evt.latLng.lat(), lng: evt.latLng.lng()});
		});
	
		//google.maps.event.clearInstanceListeners(this.state.map);
	},

	//FETCH images connected to this marker
	markerClick: function (cb) {
		let id = this._id;
		let xhr = new XMLHttpRequest();
		xhr.onreadystatechange = () => {
			if(xhr.readyState === 4 && xhr.status === 200) {
				let json = JSON.parse(xhr.responseText);
				cb(json);
			}
		}
		xhr.open('GET', '/api/point/'+id);
		xhr.send();
	}
}