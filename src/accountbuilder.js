/**
 * Calculate the stats for a coin pair
 *
 * @export
 * @param {any} collection
 * @param {number} [spikeThreshold=0.2]
 * @param {number} [dropThreshold=0.2]
 * @returns Object stats for coin pair
 */
export function calculateStats(
	collection,
	spikeThreshold = 0.2,
	dropThreshold = 0.2
) {
	return collection.reduce(
		(acc, curr, index) => {
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
		{ changeTotal: 0, spikes: [], drops: [], averageBounce: 0 }
	);
}

function calculateChange(newValue, oldValue) {
	return Math.abs((newValue - oldValue) / oldValue);
}
