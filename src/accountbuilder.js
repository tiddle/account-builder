import { getPairPrices, getMarkets } from './market/market';

/**
 * Calculate the stats for a coin pair
 *
 * @export
 * @param {any} collection
 * @param {number} [spikeThreshold=0.1]
 * @param {number} [dropThreshold=0.1]
 * @returns {object} stats for coin pair
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

			acc.changeTotal += priceBounce;

			const openDrop = calculateChange(curr.low.price, curr.open.price);
			const openSpike = calculateChange(curr.high.price, curr.open.price);

			acc.priceTotal += (curr.low.price + curr.high.price) / 2;

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
				acc.averageBounce =
					Math.round(acc.changeTotal / (index + 1) * 1000) / 10 + '%';
				delete acc.changeTotal;

				acc.averagePrice = (acc.priceTotal / (index + 1)).toString();
				delete acc.priceTotal;
			}

			return acc;
		},
		{
			changeTotal: 0,
			priceTotal: 0,
			spikes: [],
			drops: [],
			averageBounce: 0,
			averagePrice: 0,
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
			return {
				volume: price.volume,
				last: price.last,
				hour: calculateStats(price.hour),
				day: calculateStats(price.day)
			};
		});
	});

	return Promise.all(stats);
}

function calculateChange(newValue, oldValue) {
	return Math.abs((newValue - oldValue) / oldValue);
}
