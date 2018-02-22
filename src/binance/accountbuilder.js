import { getAllCandles } from './market';
import { getHighLow, calculateStats } from '../utils/price';

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
				label: price.label,
				id: price.id,
				hour: calculateStats(price.hour),
				day: calculateStats(price.day)
			};
		});
	});

	return Promise.all(stats);
}

export async function getAccountBuildersStreamable() {
	const candles = await getAllCandles();

	return candles.map(pairPrice => {
		return pairPrice.then(price => {
			const highLow = getHighLow(price.hour);
			return {
				volume: price.volume,
				last: price.last,
				low: highLow.low,
				high: highLow.high,
				label: price.label,
				id: price.id,
				hour: calculateStats(price.hour),
				day: calculateStats(price.day)
			};
		});
	});
}
