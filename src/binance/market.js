import axios from 'axios';

/**
 * Get list of markets from CPIA
 *
 * @export
 * @returns Promise
 */
export function getMarkets() {
	const url = 'https://api.binance.com/api/v1/exchangeInfo';

	return axios
		.get(url)
		.then(markets => {
			return morphBINAData(markets.data.symbols);
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
 * @param {string} id id of coin pair
 * @param {string} label of coin pair
 * @returns Promise
 */
export function getPairPrices(id, label) {
	const url = 'https://api.binance.com/api/v1/klines';

	const hourly = axios
		.get(`${url}?symbol=${id}&interval=1h`)
		.then(prices => formatCandles(prices.data));

	const daily = axios
		.get(`${url}?symbol=${id}&interval=1d`)
		.then(prices => formatCandles(prices.data));

	return Promise.all([hourly, daily]).then(prices => {
		return {
			volume: prices[0].volume,
			last: prices[0].last,
			hour: prices[0].time,
			day: prices[1].time,
			label: label,
			id: id
		};
	});
}

function morphBINAData(markets) {
	return markets
		.filter(market => market.quoteAsset === 'BTC')
		.filter(market => market.status === 'TRADING')
		.map(market => {
			return {
				label: market.baseAsset + '/' + market.quoteAsset,
				id: market.symbol
			};
		});
}

function formatCandles(candles) {
	const output = candles.map(curr => {
		return {
			low: {
				price: curr[3]
			},
			high: {
				price: curr[2]
			},
			open: {
				price: curr[1],
				timestamp: curr[0]
			},
			close: {
				price: curr[4],
				timestamp: curr[6]
			}
		};
	});

	return {
		volume: candles[candles.length - 1][10],
		last: candles[candles.length - 1][4],
		time: output
	};
}
