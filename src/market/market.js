import axios from 'axios';

import { organiseToCandles } from '../time/time';

/**
 * Get list of markets from CPIA
 *
 * @export
 * @returns Promise
 */
export function getMarkets() {
	const url = 'https://www.cryptopia.co.nz/api/GetMarkets/BTC';

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

/**
 * Get history of coin pair
 *
 * @export
 * @param {any} id id, or coin pair label
 * @returns Promise
 */
export function getPairPrices(id, volume) {
	const url = 'https://www.cryptopia.co.nz/api/GetMarketHistory/';
	const timeframeHours = 200; // 1 week

	// There seems to be a bug where GetMarketHistory caps out at 1000 results
	return axios.get(`${url}${id}/${timeframeHours}`).then(prices => {
		return organiseToCandles(prices.data.Data, volume);
	});
}

/**
 * Standardises coin data
 *
 * @param {array} markets
 * @returns
 */
function morphCPIAData(markets) {
	return markets
		.filter(market => market.BaseVolume > 0)
		.map(market => {
			return {
				volume: market.BaseVolume,
				label: market.Label,
				id: market.TradePairId
			};
		})
		.sort(sortByVolume);
}

/**
 * Sort by volume
 *
 * @param {any} marketA
 * @param {any} marketB
 * @returns
 */
function sortByVolume(marketA, marketB) {
	return marketB.volume - marketA.volume;
}
