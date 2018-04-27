import axios from 'axios';

import { organiseToCandles } from './time';

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
export function getPairPrices(id, volume = 0, last = 0) {
	const url = 'https://www.cryptopia.co.nz/api/GetMarketHistory/';
	const timeframeHours = 200; // 1 week

	// There seems to be a bug where GetMarketHistory caps out at 1000 results
	return axios.get(`${url}${id}/${timeframeHours}`).then(prices => {
		return organiseToCandles(prices.data.Data, volume, last);
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
				id: market.TradePairId,
				last: market.LastPrice
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

/**
 * Creates candles for all available markets
 *
 * @export
 * @returns {Promise}
 */
export function getAllCandles() {
	return getMarkets()
		.then(markets => {
			const pairPrices = markets
				.slice(0, 10) // only the first 10
				.filter(market => market.volume > 1) // only those with volumes
				.map(market => {
					return getPairPrices(market.id, market.volume, market.last);
				});

			return Promise.all(pairPrices);
		})
		.catch(err => {
			console.log(err);
		});
}
