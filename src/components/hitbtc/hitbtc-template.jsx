import React, { Component } from 'react';
import ReactTable from 'react-table';

import { columns } from '../../utils/table-columns';

export class HitBtcTemplate extends Component {
	render() {
		return (
			<div className="cryptopia">
				<header className="App-header">
					<h1>HitBTC Account Builder Finder</h1>
				</header>
				<div>
					<h2>
						YOU WILL NEED A BROWSER PLUGIN THAT ALLOWS OVERRIDE OF
						CORS FOR HITBTC DATA
					</h2>
					<p>
						This is in early <strong>BETA</strong>
					</p>
					<p>
						I haven't had time to create an api for the data, just
						search for "allow origin browser plugin". I use "CORS
						Everywhere" on firefox.
					</p>
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
