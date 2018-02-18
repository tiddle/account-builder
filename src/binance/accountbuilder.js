import { getMarkets, getPairPrices } from './market';
import { getHighLow, calculateStats } from '../utils/price';

export async function getAccountBuilders() {
	const markets = await getMarkets();

	const pairPrices = markets
		// .slice(0, 10) // only the first 10
		.map(market => {
			return getPairPrices(market.id, market.label);
		});

	const stats = pairPrices.map(pairPrice => {
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
