import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './App.css';

import { getAccountBuilders } from './accountbuilder';

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

	columns = [
		{
			Header: 'Pair',
			accessor: 'label'
		},
		{
			Header: 'Average Bounce',
			accessor: 'averageBounce',
			sortMethod: (a, b) => {
				return parseInt(a) - parseInt(b);
			},
			filterMethod: this.greaterThanFilter
		},
		{
			Header: 'Volume',
			accessor: 'volume',
			filterMethod: this.greaterThanFilter
		},
		{
			Header: 'Spikes',
			id: 'spikes',
			accessor: price => price.spikes.length,
			filterMethod: this.greaterThanFilter
		},
		{
			Header: 'Drops',
			id: 'drops',
			accessor: price => price.drops.length,
			filterMethod: this.greaterThanFilter
		},
		{
			Header: 'Last Price',
			accessor: 'last',
			filterMethod: this.greaterThanFilter
		}

	];

	greaterThanFilter(filter, row) {
		if (!filter.value) {
			return true;
		}

		if (parseInt(row[filter.id]) > filter.value) {
			return true;
		}
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<h1>Cryptopia Account Builder Finder</h1>
				</header>
				{this.state.stats && (
					<div>
						<p>This data starts from approx 41 days ago</p>
						<ReactTable
							filterable
							data={this.state.stats}
							columns={this.columns}
						/>
					</div>
				)}

				{!this.state.stats && <p>Loading...</p>}

				<h2>Notes:</h2>
				<ul>
					<li>Spikes are 10% greater than opening price</li>
					<li>Drops are 10% less than opening price</li>
					<li>
						Shift clicking column headers allows sorting of multiple
						columns
					</li>
				</ul>
			</div>
		);
	}
}

export default App;
