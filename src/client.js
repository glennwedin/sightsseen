"use strict";

import React from "react";
import ReactDOM from "react-dom";
import { Router, browserHistory } from "react-router";
import mainroute from "./routes/routes";
import "!style!css!sass!./scss/style.scss";


var routing = mainroute(browserHistory);

ReactDOM.render(routing, document);