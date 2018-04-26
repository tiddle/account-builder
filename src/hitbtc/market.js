import axios from 'axios';
import ccxt from 'ccxt';
import { delay } from 'lodash';

import { marketUtil } from '../utils/market';
import { URLS } from '../constants/marketUrls';

export function getExchange() {
	return new ccxt.hitbtc2();
}
/**
 * Get list of markets from hitbtc
 *
 * @export
 * @returns Promise
 */
export function getMarkets(exchange) {
	if(exchange) {
		return exchange.loadMarkets();
	}

	return false;
}

function morphHITBTCData(markets) {
	return markets
		.filter(market => market.info.quoteCurrency === 'BTC')
		// .slice(0, 5) // only the first 5
		.map(market => {
			return {
				label: market.symbol,
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

export async function getAllCandles() {
	const exchange = getExchange();
	const markets = await getMarkets(exchange);
	const morphedMarkets = morphHITBTCData(Object.values(markets));
	const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

	return morphedMarkets.map(async (market, i) => {

		await sleep(exchange.rateLimit * i + 500); // milliseconds
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
