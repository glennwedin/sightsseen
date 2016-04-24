import express from "express";
import React from "react";
import { match, RouterContext } from "react-router";
import { renderToString } from 'react-dom/server';
import bodyParser from "body-parser";
import mainroute from "./routes/routes";
import apirouter from "./routes/api";


var app = express();

//Point to static files
app.use(express.static('public/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', apirouter);

app.get('*', function (req, res) {
	let routes = mainroute();
	match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
		if (error) {
			res.status(500).send(error.message)
		} else if (redirectLocation) {
			res.redirect(302, redirectLocation.pathname + redirectLocation.search)
		} else if (renderProps) {
			res.status(200).send('<!DOCTYPE html>'+renderToString(<RouterContext {...renderProps} />));
		} else {
			res.status(404).send('Not found')
		}
	});
});

//Listen on port
app.listen(3000);
