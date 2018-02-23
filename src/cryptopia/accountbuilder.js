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

	return candles.map(price => {
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
}

export async function getAccountBuildersStreamable() {
	const candles = await getAllCandles();
	console.log(candles);

	return candles.map(price => {
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
}
