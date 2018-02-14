import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { getAccountBuilders } from './accountbuilder';
import { bounce } from './filters/filters';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {};

		getAccountBuilders().then(results => {
			this.setState({
				stats: bounce(results, 3)
			});
		});
	}

	viewtiful(collection) {
		console.log(collection);
		return collection.reduce((acc, curr) => {
			const element = (
				<li>
					<h2>{curr.label}</h2>
					<p>Average bounce: {curr.averageBounce}</p>
					{curr.spikes.length !== 0 && (
						<div>
							<p>Recent Spikes:</p>
							<ul>
								{curr.spikes.map(spike => {
									return (
										<li>
											<p>
												Price: {spike.details.low.price}
											</p>
											<p>
												Timestamp:{' '}
												{spike.details.low.timestamp}
											</p>
										</li>
									);
								})}
							</ul>
						</div>
					)}
					{curr.drops.length !== 0 && (
						<div>
							<p>Recent Drops:</p>
							<ul>
								{curr.drops.map(drop => {
									return (
										<li>
											<p>
												Price: {drop.details.low.price}
											</p>
											<p>
												Timestamp:{' '}
												{drop.details.low.timestamp}
											</p>
										</li>
									);
								})}
							</ul>
						</div>
					)}
				</li>
			);

			acc.push(element);

			return acc;
		}, []);
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to React</h1>
				</header>
				{this.state.stats && (
					<ul className="App-intro">
						{this.viewtiful(this.state.stats)}
					</ul>
				)}
			</div>
		);
	}
}

export default App;
