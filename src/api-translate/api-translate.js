import { calculateStats, getHighLow } from '../utils/price';

/**
 * Get list of markets from hitbtc
 *
 * @export
 * @returns Promise
 */
export function getMarkets(exchange) {
	if (exchange) {
		return exchange.loadMarkets();
	}

	return false;
}

/**
 * Morph market list to useable format
 *
 * @param {Array} markets
 */
export function morphExchangeData(markets) {
	return markets
		.filter(market => market.active)
		.filter(market => market.quote === 'BTC')
		.map(market => {
			return {
				original: market,
				label: market.symbol,
				id: market.symbol
			};
		});
}

/**
 * Format candles to be app specific
 *
 * @param {Array} candles
 */
export function formatCandles(candles) {
	// OHLCV
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
				timestamp: new Date(curr[0]).getTime()
			},
			close: {
				price: curr[4],
				timestamp: new Date(curr[0]).getTime()
			}
		};
	});

	return {
		volume: candles[candles.length - 1][5],
		last: candles[candles.length - 1][4],
		time: output
	};
}

export async function getAllCandles(exchangeFunc) {
	const exchange = exchangeFunc();
	const markets = await getMarkets(exchange);
	const morphedMarkets = morphExchangeData(Object.values(markets));
	const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

	const ignoreSleepExchanges = ['cryptopia', 'binance'];

	return morphedMarkets.map(async (market, i) => {
		if (ignoreSleepExchanges.indexOf(exchange.id) < 0) {
			await sleep(exchange.rateLimit * i); // milliseconds
		}
		const OHLCV = await exchange.fetchOHLCV(market.id, '1h', 9999999);
		const hour = formatCandles(OHLCV);
		return {
			volume: hour.volume,
			last: hour.last,
			hour: hour.time,
			label: market.label,
			id: market.id
		};
	});
}

export function formatForTable(price) {
	const highLow = getHighLow(price.hour);
	return {
		volume: price.volume,
		last: price.last,
		low: highLow.low,
		high: highLow.high,
		hour: calculateStats(price.hour, price.label, price.id),
		id: price.id,
		label: price.label
	};
}
