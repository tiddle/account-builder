import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { getPairPrices } from './market-utils/market';

class App extends Component {
	componentWillMount() {
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
