import React from "react";
import { Link } from "react-router";

export default class MainComponent extends React.Component {

	constructor () {
		super();
	}

	render () {
		return (<html lang="en">
					<head>
						<meta charSet="UTF-8" />
						<meta name="viewport" content="width=device-width, user-scalable=no" />
						<title>Maps/mongodb/node geospatial example application</title>
						<link href="https://fonts.googleapis.com/css?family=Roboto:400,300,500" rel="stylesheet" type="text/css" />
						<link rel="stylesheet" type="text/css" href="http://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" />
						<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCNjEAzE3PIfuRIX-c9WilAu8cb27ozXEg"></script>
						<script src="https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.6/hammer.min.js"></script>
					</head>
					<body>
						<div id="app">{this.props.children}</div>
						<script type="text/javascript" src="js/app.js"></script>
					</body>
				</html>);
	}
}