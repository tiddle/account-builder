import React from 'react';
import numeral from 'numeral';
import { get } from 'lodash';

export const columns = [
	{
		Header: 'Pair',
		accessor: 'label'
	},
	{
		Header: 'Hours of Data',
		id: 'dataAmount',
		accessor: price => get(price, 'hour.amountOfData', false)
	},
	{
		Header: 'Average Bounce',
		accessor: 'hour.averageBounce',
		sortMethod: (a, b) => {
			return parseFloat(a) - parseFloat(b, 10);
		},
		filterMethod: greaterThanFilter
	},
	{
		Header: 'Volume',
		accessor: 'volume',
		filterMethod: greaterThanFilter,
		sortMethod: sortForceNumber
	},
	{
		Header: 'Spikes',
		id: 'spikes',
		accessor: price => get(price, 'hour.spikes', []).length,
		filterMethod: greaterThanFilter
	},
	{
		Header: 'Drops',
		id: 'drops',
		accessor: price => get(price, 'hour.drops', []).length,
		filterMethod: greaterThanFilter
	},
	{
		Header: 'Last Price (sat)',
		accessor: 'last',
		id: 'lastSat',
		filterMethod: greaterThanFilterSatoshi,
		sortMethod: sortForceNumber,
		Cell: satoshiFormat
	},
	{
		Header: 'Last Price (btc)',
		accessor: 'last',
		id: 'lastBtc',
		sortMethod: sortForceNumber,
		filterMethod: greaterThanFilter
	},
	{
		Header: 'Low Price (sat)',
		accessor: 'low',
		id: 'lowSat',
		filterMethod: greaterThanFilterSatoshi,
		sortMethod: sortForceNumber,
		Cell: satoshiFormat
	},
	{
		Header: 'Low Price (btc)',
		accessor: 'low',
		id: 'lowBtc',
		sortMethod: sortForceNumber,
		filterMethod: greaterThanFilter
	},
	{
		Header: 'High Price (sat)',
		accessor: 'high',
		id: 'highSat',
		filterMethod: greaterThanFilterSatoshi,
		sortMethod: sortForceNumber,
		Cell: satoshiFormat
	},
	{
		Header: 'High Price (btc)',
		accessor: 'high',
		id: 'highBtc',
		sortMethod: sortForceNumber,
		filterMethod: greaterThanFilter
	}
];

function satoshiFormat(row) {
	return (
		<span style={{ display: 'block', textAlign: 'right' }}>
			{numeral(Math.floor(row.value * 100000000)).format('0,0')} sat
		</span>
	);
}

function greaterThanFilter(filter, row) {
	if (!filter.value) {
		return true;
	}

	if (parseFloat(row[filter.id], 10) > filter.value) {
		return true;
	}
}

function greaterThanFilterSatoshi(filter, row) {
	if (!filter.value) {
		return true;
	}

	if (parseInt(row[filter.id] * 100000000, 10) > filter.value) {
		return true;
	}
}

function sortForceNumber(a, b) {
	return parseFloat(a) - parseFloat(b);
}
