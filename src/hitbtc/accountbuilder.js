import { getAllCandles } from './market';

import { calculateStats, getHighLow } from '../utils/price';

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
				hour: calculateStats(price.hour, price.label, price.id),
				id: price.id,
				label: price.label
			};
		});
	});
}
