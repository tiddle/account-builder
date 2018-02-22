import { getAllCandles } from './market';
import { calculateStats, getHighLow } from '../utils/price';

/**
 * Get account builders
 *
 * @export function
 * @returns
 */
export async function getAccountBuilders() {
	const candles = await getAllCandles();

	const stats = candles.map(pairPrice => {
		return pairPrice.then(price => {
			const highLow = getHighLow(price.hour);
			return {
				volume: price.volume,
				last: price.last,
				low: highLow.low,
				high: highLow.high,
				hour: calculateStats(price.hour, price.label, price.id),
				day: calculateStats(price.day, price.label, price.id),
				id: price.id,
				label: price.label
			};
		});
	});

	return Promise.all(stats);
}

export async function getAccountBuildersStreamable() {
	const candles = getAllCandles();

	return candles.map(pairPrice => {
		console.log(pairPrice);
		return pairPrice.then(price => {
			const highLow = getHighLow(price.hour);
			return {
				volume: price.volume,
				last: price.last,
				low: highLow.low,
				high: highLow.high,
				hour: calculateStats(price.hour, price.label, price.id),
				day: calculateStats(price.day, price.label, price.id),
				id: price.id,
				label: price.label
			};
		});
	});
}
