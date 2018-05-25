import React, { Component } from 'react';
import ReactTable from 'react-table';

import { columns } from '../../utils/table-columns';

export class HitBtcTemplate extends Component {
	render() {
		return (
			<div className="cryptopia">
				<header className="App-header">
					<h2>{this.props.exchange}</h2>
				</header>
				<div>
					<p>This is slower than the others because HitBTC actually enforces their rate limits</p>
				</div>
				{this.props.stats && (
					<div>
						<h2>Hourly Candles</h2>
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
