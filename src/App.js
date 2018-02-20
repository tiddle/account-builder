import React, { Component } from 'react';
import ReactTable from 'react-table';
import numeral from 'numeral';

import 'react-table/react-table.css';
import './App.css';

import { getAccountBuildersStreamable } from './cryptopia/accountbuilder';
import { getAccountBuildersStreamable as binaGetAccountBuildersStreamable } from './binance/accountbuilder';
import PromisePool from './utils/promise-pool.js';
import { getMarkets, getPairPrices } from './hitbtc/market';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			exchange: 'Cryptopia'
		};

		getMarkets().then(result => {
			console.log(result);
		});

		getPairPrices('ETHBTC', 'ETH/BTC').then(result => {
			console.log(result);
		});
	}

	async componentWillMount() {
		// const promisePool = new PromisePool();
		// let promises;
		// /**
		//  * Each time one of the promises in the PromisePool
		//  * is resolved (or rejected), it will trigger this.
		//  */
		// promisePool.subscribe((actionType, data) => {
		// 	if (actionType === 'settled') {
		// 		this.setState(state => {
		// 			return {
		// 				...state,
		// 				stats: state.stats.concat([data])
		// 			};
		// 		});
		// 	} else if (actionType === 'finalized') {
		// 		// they're all finished, let's clean up
		// 		promisePool.terminate();
		// 	}
		// });
		// if (window.location.search.indexOf('BINA') !== -1) {
		// 	console.log('BINANCE PLEASE');
		// 	this.setState({
		// 		exchange: 'Binance'
		// 	});
		// 	promises = await binaGetAccountBuildersStreamable();
		// } else {
		// 	promises = await getAccountBuildersStreamable();
		// }
		// /**
		//  * set the initial container for the results
		//  */
		// this.setState({ stats: [] });
		// /**
		//  * Add each request to the promise pool so we can listen to it
		//  */
		// promises.map(req => promisePool.add(req));
	}

	columns = [
		{
			Header: 'Pair',
			accessor: 'label'
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
			filterMethod: this.greaterThanFilter,
			sortMethod: this.sortForceNumber
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
			sortMethod: this.sortForceNumber,
			Cell: this.satoshiFormat
		},
		{
			Header: 'Last Price (btc)',
			accessor: 'last',
			id: 'lastBtc',
			sortMethod: this.sortForceNumber,
			filterMethod: this.greaterThanFilter
		},
		{
			Header: 'Low Price (sat)',
			accessor: 'low',
			id: 'lowSat',
			filterMethod: this.greaterThanFilterSatoshi,
			sortMethod: this.sortForceNumber,
			Cell: this.satoshiFormat
		},
		{
			Header: 'Low Price (btc)',
			accessor: 'low',
			id: 'lowBtc',
			sortMethod: this.sortForceNumber,
			filterMethod: this.greaterThanFilter
		},
		{
			Header: 'High Price (sat)',
			accessor: 'high',
			id: 'highSat',
			filterMethod: this.greaterThanFilterSatoshi,
			sortMethod: this.sortForceNumber,
			Cell: this.satoshiFormat
		},
		{
			Header: 'High Price (btc)',
			accessor: 'high',
			id: 'highBtc',
			sortMethod: this.sortForceNumber,
			filterMethod: this.greaterThanFilter
		}
	];

	satoshiFormat(row) {
		return (
			<span style={{ display: 'block', textAlign: 'right' }}>
				{numeral(Math.floor(row.value * 100000000)).format('0,0')} sat
			</span>
		);
	}

	greaterThanFilter(filter, row) {
		if (!filter.value) {
			return true;
		}

		if (parseFloat(row[filter.id]) > filter.value) {
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

	sortForceNumber(a, b) {
		return parseFloat(a) - parseFloat(b);
	}

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<h1>{this.state.exchange} Account Builder Finder</h1>
				</header>
				{this.state.exchange === 'Binance' && (
					<div>
						<h2>
							YOU WILL NEED A BROWSER PLUGIN THAT ALLOWS OVERRIDE
							OF CORS FOR BINANCE DATA
						</h2>
						<p>
							This is in early <strong>BETA</strong>
						</p>
						<p>
							I haven't had time to create an api for the data,
							just search for "allow origin browser plugin". I use
							"CORS Everywhere" on firefox.
						</p>
					</div>
				)}

				{this.state.exchange !== 'Binance' && (
					<p>
						<a href="?BINA">Binance Account Builders</a>
					</p>
				)}

				{this.state.stats && (
					<div>
						<h2>Hourly Candles</h2>
						<ReactTable
							filterable
							data={this.state.stats}
							columns={this.columns}
						/>

						<h2>Daily Candles</h2>
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
