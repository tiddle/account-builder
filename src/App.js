import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { getPairPrices } from './market/market';
import { calculateStats } from './accountbuilder';

class App extends Component {
	componentWillMount() {
		getPairPrices(2915).then(prices => {
			console.log(prices);
			console.log(calculateStats(prices));
		})
	}

	render() {
		return (
			<div className="App">
				<h1>Hello</h1>
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to React</h1>
				</header>
				<p className="App-intro">
					To get started, edit <code>src/App.js</code> and save to
					reload.
				</p>
			</div>
		);
	}
}

export default App;
