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
		.filter(market => market.quote === 'BTC')
		// .slice(0, 5) // only the first 5
		.map(market => {
			return {
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
	console.log(exchange);
	const markets = await getMarkets(exchange);
	const morphedMarkets = morphExchangeData(Object.values(markets));
	console.log(markets, morphedMarkets);
	const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

	return morphedMarkets.map(async (market, i) => {
		await sleep(exchange.rateLimit * i); // milliseconds
		const hour = formatCandles(await exchange.fetchOHLCV(market.id, '1h'));
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
