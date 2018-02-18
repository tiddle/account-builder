import { getPairPrices, getMarkets } from './market';
import { calculateStats, getHighLow } from '../utils/price';


/**
 * Get account builders
 *
 * @export function
 * @returns
 */
export async function getAccountBuilders() {
	const markets = await getMarkets();

	const pairPrices = markets
		// .slice(0, 10) // only the first 10
		.filter(market => market.volume > 1) // only those with volumes
		.map(market => {
			return getPairPrices(market.id, market.volume, market.last);
		});

	const stats = pairPrices.map(pairPrice => {
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
