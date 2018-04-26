import React, { Component } from 'react';
import ReactTable from 'react-table';

import 'react-table/react-table.css';
import './App.css';

import { getAccountBuildersStreamable } from './cryptopia/accountbuilder';
import { getAccountBuildersStreamable as binaGetAccountBuildersStreamable } from './binance/accountbuilder';
import { getAccountBuildersStreamable as hitbcGetAccountBuildersStreamable } from './hitbtc/accountbuilder';
import { Cryptopia } from './components/cryptopia/cryptopia-template';
import PromisePool from './utils/promise-pool.js';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			exchange: 'Cryptopia'
		};
	}

	async componentWillMount() {
		const promisePool = new PromisePool();
		let promises;
		/**
		 * Each time one of the promises in the PromisePool
		 * is resolved (or rejected), it will trigger this.
		 */
		promisePool.subscribe((actionType, data) => {
			if (actionType === 'settled') {
				this.setState(state => {
					return {
						...state,
						stats: state.stats.concat([data])
					};
				});
			} else if (actionType === 'finalized') {
				// they're all finished, let's clean up
				promisePool.terminate();
			}
		});

		if (window.location.search.indexOf('BINA') !== -1) {
			this.setState({
				exchange: 'Binance'
			});
			promises = await binaGetAccountBuildersStreamable();
		} else {
			promises = await hitbcGetAccountBuildersStreamable();
		}
		/**
		 * set the initial container for the results
		 */
		this.setState({ stats: [] });
		/**
		 * Add each request to the promise pool so we can listen to it
		 */
		promises.map(req => promisePool.add(req));
	}

	render() {
		return (
			<div className="App">
				<Cryptopia stats={this.state.stats} />

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
