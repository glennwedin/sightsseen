import React from "react";
import {Router, Route, IndexRoute} from "react-router";
import MainComponent from "../components/MainComponent";
import MapComponent from "../components/MapComponent";

var mainroute = (history) => {
	history = history || null;
	return (<Router history={history}>
				<Route path="/" component={MainComponent} >
					<IndexRoute component={MapComponent} />
				</Route>
			</Router>);
};

export default mainroute;