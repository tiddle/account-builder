import React, { Component } from 'react';
import ReactTable from 'react-table';

import { columns } from '../../utils/table-columns';

export class Cryptopia extends Component {
	render() {
		return (
			<div className="cryptopia">
				<header className="App-header">
					<h1>Cryptopia Account Builder Finder</h1>
				</header>

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
