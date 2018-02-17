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

	hourColumns = [
		{
			Header: 'Pair',
			accessor: 'hour.label',
			Cell: row => {
				return (
					<a
						href={`https://coinigy.com/main/markets/CPIA/${row.value}`}
						target="_blank"
					>
						{row.value}
					</a>
				);
			}
		},
		{
			Header: 'Average Bounce',
			accessor: 'hour.averageBounce',
			sortMethod: (a, b) => {
				return parseInt(a, 10) - parseInt(b, 10);
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
			accessor: price => price.hour.spikes.length,
			filterMethod: this.greaterThanFilter
		},
		{
			Header: 'Drops',
			id: 'drops',
			accessor: price => price.hour.drops.length,
			filterMethod: this.greaterThanFilter
		},
		{
			Header: 'Last Price (sat)',
			accessor: 'last',
			id: 'lastSat',
			filterMethod: this.greaterThanFilterSatoshi,
			Cell: row => <span>{Math.floor(row.value * 100000000)} sat</span>
		},
		{
			Header: 'Last Price (btc)',
			accessor: 'last',
			id: 'lastBtc',
			filterMethod: this.greaterThanFilter
		},
		{
			Header: 'Low Price (sat)',
			accessor: 'low',
			id: 'lowSat',
			filterMethod: this.greaterThanFilterSatoshi,
			Cell: row => <span>{Math.floor(row.value * 100000000)} sat</span>
		},
		{
			Header: 'Low Price (btc)',
			accessor: 'low',
			id: 'lowBtc',
			filterMethod: this.greaterThanFilter
		},
		{
			Header: 'High Price (sat)',
			accessor: 'high',
			id: 'highSat',
			filterMethod: this.greaterThanFilterSatoshi,
			Cell: row => <span>{Math.floor(row.value * 100000000)} sat</span>
		},
		{
			Header: 'High Price (btc)',
			accessor: 'high',
			id: 'highBtc',
			filterMethod: this.greaterThanFilter
		}
	];

	dayColumns = [
		{
			Header: 'Pair',
			accessor: 'day.label',
			Cell: row => {
				return (
					<a
						href={`https://coinigy.com/main/markets/CPIA/${row.value}`}
						target="_blank"
					>
						{row.value}
					</a>
				);
			}
		},
		{
			Header: 'Average Bounce',
			accessor: 'day.averageBounce',
			sortMethod: (a, b) => {
				return parseInt(a, 10) - parseInt(b, 10);
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
			accessor: price => price.day.spikes.length,
			filterMethod: this.greaterThanFilter
		},
		{
			Header: 'Drops',
			id: 'drops',
			accessor: price => price.day.drops.length,
			filterMethod: this.greaterThanFilter
		},
		{
			Header: 'Last Price (sat)',
			accessor: 'last',
			id: 'lastSat',
			filterMethod: this.greaterThanFilterSatoshi,
			Cell: row => <span>{Math.floor(row.value * 100000000)} sat</span>
		},
		{
			Header: 'Last Price (btc)',
			accessor: 'last',
			id: 'lastBtc',
			filterMethod: this.greaterThanFilter
		},
		{
			Header: 'Low Price (sat)',
			accessor: 'low',
			id: 'lowSat',
			filterMethod: this.greaterThanFilterSatoshi,
			Cell: row => <span>{Math.floor(row.value * 100000000)} sat</span>
		},
		{
			Header: 'Low Price (btc)',
			accessor: 'low',
			id: 'lowBtc',
			filterMethod: this.greaterThanFilter
		},
		{
			Header: 'High Price (sat)',
			accessor: 'high',
			id: 'highSat',
			filterMethod: this.greaterThanFilterSatoshi,
			Cell: row => <span>{Math.floor(row.value * 100000000)} sat</span>
		},
		{
			Header: 'High Price (btc)',
			accessor: 'high',
			id: 'highBtc',
			filterMethod: this.greaterThanFilter
		}
	];

	greaterThanFilter(filter, row) {
		if (!filter.value) {
			return true;
		}

		if (parseInt(row[filter.id], 10) > filter.value) {
			return true;
		}
	}

	greaterThanFilterSatoshi(filter, row) {
		if (!filter.value) {
			return true;
		}

		if (parseInt(row[filter.id] * 100000000, 10) > filter.value) {
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

						<h2>Hourly Candles</h2>
						<ReactTable
							filterable
							data={this.state.stats}
							columns={this.hourColumns}
						/>

						<h2>Daily Candles</h2>
						<ReactTable
							filterable
							data={this.state.stats}
							columns={this.dayColumns}
						/>
					</div>
				)}

				{!this.state.stats && <p>Loading...</p>}

				<h2>Notes:</h2>
				<ul>
					<li>
						Spikes are 10% greater than opening price of candles
					</li>
					<li>Drops are 10% less than opening price of candles</li>
					<li>
						Spike and Drop counters are the amount of times a candle
						exceeds the 10% threshold within the data set
					</li>
					<li>
						Shift clicking column headers allows sorting of multiple
						columns
					</li>
					<li>
						Number filters work on a greater than way. So, entering
						3 will only display any result greater than 3
					</li>
				</ul>

				<h3>Donations can go here: </h3>
				<ul>
					<li>BTC: 1N3AV4c39ptt8uYxkuPZqC2CMjofLNnpgc</li>
					<li>ETH: 0xe88eee1386e8fa09d17ad7cbb736c09c28dbe4f7</li>
					<li>LTC: LhEGzB7Qbk3z2c53ERodhhVXhZhfNJziRY</li>
					<li>
						XRP: rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh Tag: 106071489
					</li>
				</ul>
			</div>
		);
	}
}

export default App;
