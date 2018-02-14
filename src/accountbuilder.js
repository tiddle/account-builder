import { getPairPrices, getMarkets } from './market/market';

/**
 * Calculate the stats for a coin pair
 *
 * @export
 * @param {any} collection
 * @param {number} [spikeThreshold=0.1]
 * @param {number} [dropThreshold=0.1]
 * @returns Object stats for coin pair
 */
export function calculateStats(
	collection,
	spikeThreshold = 0.1,
	dropThreshold = 0.1
) {
	return collection.reduce(
		(acc, curr, index) => {
			acc.label = curr.open.label;
			acc.id = curr.open.id;

			// Calculate average bounce from low to high
			const priceBounce = calculateChange(
				curr.low.price,
				curr.high.price
			);
			const openDrop = calculateChange(curr.low.price, curr.open.price);
			const openSpike = calculateChange(curr.high.price, curr.open.price);

			acc.changeTotal += priceBounce;

			if (openSpike > spikeThreshold) {
				acc.spikes.push({
					index: index,
					details: curr
				});
			}

			if (openDrop > dropThreshold) {
				acc.drops.push({
					index: index,
					details: curr
				});
			}

			if (index + 1 === collection.length) {
				acc.averageBounce = acc.changeTotal / (index + 1);
				delete acc.changeTotal;
			}

			return acc;
		},
		{
			changeTotal: 0,
			spikes: [],
			drops: [],
			averageBounce: 0,
			label: '',
			id: ''
		}
	);
}

/**
 * Get account builders
 *
 * @export function
 * @returns
 */
export function getAccountBuilders() {
	return getMarkets().then(markets => {
		return markets.reduce(async (acc, curr, index) => {
			const collection = await acc;
			if (curr.volume > 1 && index < 10) {
				const stats = await getPairPrices(curr.id).then(calculateStats);
				collection.push(stats);
			}

			return collection;
		}, []);

	});
}

function calculateChange(newValue, oldValue) {
	return Math.abs((newValue - oldValue) / oldValue);
}
