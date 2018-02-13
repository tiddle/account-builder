export function calculateStats(collection) {
	return collection.reduce(
		(acc, curr, index) => {
			// Calculate average bounce from low to high
			const priceBounce = calculateChange(
				curr.low.Price,
				curr.high.Price
			);
			const openDrop = calculateChange(curr.low.Price, curr.open.Price);
            const openSpike = calculateChange(curr.high.Price, curr.open.Price);
            console.log(openSpike);

			acc.changeTotal += priceBounce;

			if (openSpike > 0.2) {
				acc.spikes.push({
					index: index,
					details: curr
				});
			}

			if (openDrop > 0.2) {
				acc.drops.push({
					index: index,
					details: curr
				});
			}

			return acc;
		},
		{ changeTotal: 0, spikes: [], drops: [] }
	);
}

function calculateChange(newValue, oldValue) {
	return Math.abs((newValue - oldValue) / oldValue);
}
