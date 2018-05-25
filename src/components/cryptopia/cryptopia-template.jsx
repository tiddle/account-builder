import React, { Component } from 'react';
import ReactTable from 'react-table';

import { columns } from '../../utils/table-columns';

export class Cryptopia extends Component {
	render() {
		return (
			<div className="cryptopia">
				<header className="App-header">
					<h2>{this.props.exchange}</h2>
				</header>
				{this.props.exchange === 'HitBtc' && (
					<div>
						<p>
							This is slower than the others because HitBTC
							actually enforces their rate limits. This could take
							5 mins or so.
						</p>
					</div>
				)}

				{this.props.stats && (
					<div>
						<h3>Hourly Candles</h3>
						<ReactTable
							filterable
							data={this.props.stats}
							columns={columns}
						/>
					</div>
				)}

				{!this.props.stats && <p>Loading...</p>}
			</div>
		);
	}
}
