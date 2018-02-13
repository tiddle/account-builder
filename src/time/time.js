export function organiseToCandles(collection) {
	// this outputs a weird object and not an array
	const candles = collection.reduce((acc, curr, index) => {
		const hourTimestamp = getTimestampHour(curr.Timestamp);

		if (!acc[hourTimestamp]) {
			acc[hourTimestamp] = {};
		}

		if (acc[hourTimestamp] && !acc[hourTimestamp].high) {
			acc[hourTimestamp].low = curr;
			acc[hourTimestamp].high = curr;
		}

		if (acc[hourTimestamp] && !acc[hourTimestamp].open) {
			acc[hourTimestamp].open = curr;
		}

		if (acc[hourTimestamp].low.Price > curr.Price) {
			acc[hourTimestamp].low = curr;
		}

		if (acc[hourTimestamp].high.Price < curr.Price) {
			acc[hourTimestamp].high = curr;
		}

		acc[hourTimestamp].close = curr;

		return acc;
	}, []);

    // This fixes the weird output and turns it into a proper array
	const keys = Object.keys(candles);

	return keys.map(key => {
		const output = candles[key];
		output.timestamp = key;

		return output;
	});
}

// function cpiaPriceClean(priceObj) {
// 	return {
// 		amount: priceObj.Amount,
// 		price: priceObj.Price,
// 		timestamp: priceObj.Timestamp
// 	};
// }

function getTimestampHour(timestamp) {
	const currTime = new Date(timestamp * 1000);

	currTime.setMinutes(0, 0, 0);
	return currTime.getTime();
}
