import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
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
				stats: results
			});
		});
	}

	viewtiful(collection) {
		return collection.reduce((acc, curr) => {
			const element = (
				<li>
					<h2>{curr.label}</h2>
					<p>Average bounce: {curr.averageBounce}</p>
					<p>Average price: {curr.averagePrice}</p>
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

	columns = [{
		Header: 'Pair',
		accessor: 'label'
	}, {
		Header: 'Average Bounce',
		accessor: 'averageBounce'
	}, {
		Header: 'Average Price',
		accessor: 'averagePrice'
	}];

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to React</h1>
				</header>
				{this.state.stats && (
					<ReactTable data={this.state.stats} columns={this.columns}/>
				)}
			</div>
		);
	}
}

export default App;
