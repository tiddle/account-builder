import axios from 'axios';

import { organiseToCandles } from '../time/time';

export function getMarkets() {
	const url = 'https://www.cryptopia.co.nz/api/GetMarkets';

	return axios
		.get(url)
		.then(markets => {
			return morphCPIAData(markets.data.Data);
		})
		.catch(err => {
			console.error('getMarkets', err);
			throw new Error(err);
		});
}

export function getPairPrices(id) {
	const url = 'https://www.cryptopia.co.nz/api/GetMarketHistory/';
	const timeframeHours = 168; // 1 week

	return axios.get(`${url}${id}/${timeframeHours}`).then(prices => {
		return organiseToCandles(prices.data.Data)
	});
}

function morphCPIAData(markets) {
	return markets
		.map(market => {
			return {
				volume: market.Volume,
				label: market.Label,
				id: market.TradePairId
			};
		})
		.sort(sortByVolume);
}

function sortByVolume(marketA, marketB) {
	return marketB.volume - marketA.volume;
}
