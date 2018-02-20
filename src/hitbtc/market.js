import axios from 'axios';

import { marketUtil } from '../utils/market';
import { URLS } from '../constants/marketUrls';
/**
 * Get list of markets from hitbtc
 *
 * @export
 * @returns Promise
 */
export function getMarkets() {
	const url = URLS.hitBTC.base + URLS.hitBTC.markets;
	return marketUtil(url, morphHITBTCData);
}

/**
 * Get history of coin pair
 *
 * @export
 * @param {string} id id of coin pair
 * @param {string} label of coin pair
 * @returns Promise
 */
export function getPairPrices(id, label) {
	const url = URLS.hitBTC.base + URLS.hitBTC.coinPair;
	console.log(url);

	const hourly = axios
		.get(`${url}${id}?period=H1`)
		.then(prices => formatCandles(prices.data));

	// const daily = axios
	// 	.get(`${url}?symbol=${id}&interval=1d`)
	// 	.then(prices => formatCandles(prices.data));

	return Promise.all([hourly]).then(prices => {
		return prices;
		// return {
		// 	volume: prices.volume,
		// 	last: prices.last,
		// 	hour: prices.time,
		// 	day: prices.time,
		// 	label: label,
		// 	id: id
		// };
	});
}

function morphHITBTCData(markets) {
	return markets.data
		.filter(market => market.quoteCurrency === 'BTC')
		.map(market => {
			return {
				label: market.baseCurrency + '/' + market.quoteCurrency,
				id: market.id
			};
		});
}

function formatCandles(candles) {
	const output = candles.map(curr => {
		return {
			low: {
				price: curr.min
			},
			high: {
				price: curr.max
			},
			open: {
				price: curr.open,
				timestamp: new Date(curr.timestamp).getTime()
			},
			close: {
				price: curr.close,
				timestamp: new Date(curr.timestamp).getTime()
			}
		};
	});

	return {
		volume: candles[candles.length - 1][10],
		last: candles[candles.length - 1][4],
		time: output
	};
}
