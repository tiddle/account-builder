/**
 * Get lowest and highest price of coin pair
 *
 * @param {array} prices
 * @returns {object}
 */
export function getHighLow(prices) {
	return prices.reduce(
		(acc, curr) => {
			if (acc.low > curr.low.price) {
				acc.low = curr.low.price;
			}

			if (acc.high < curr.high.price) {
				acc.high = curr.high.price;
			}

			return acc;
		},
		{ low: 9999999999, high: 0 }
	);
}

/**
 * Calculate percentage change
 *
 * @param {number} newValue
 * @param {number} oldValue
 * @returns {float}
 */
export function calculateChange(newValue, oldValue) {
	return Math.abs((newValue - oldValue) / oldValue);
}

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
	label,
	id,
	spikeThreshold = 0.1,
	dropThreshold = 0.1
) {
	return collection.reduce(
		(acc, curr, index) => {
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
			label: label,
			amountOfData: collection.length,
			id: id
		}
	);
}
