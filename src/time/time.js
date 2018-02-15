/**
 * Organise data into candles
 *
 * @export
 * @param {any} collection
 * @param {number} volume
 * @param {number} last
 * @returns {array}
 */
export function organiseToCandles(collection, volume, last) {
	// this outputs a weird object and not an array
	const candles = collection.reduceRight((acc, curr, index) => {
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

	const candleData = keys.map(key => {
		const output = candles[key];
		output.timestamp = key;
		return {
			low: cpiaPriceClean(candles[key].low),
			high: cpiaPriceClean(candles[key].high),
			open: cpiaPriceClean(candles[key].open),
			close: cpiaPriceClean(candles[key].close)
		};
	});

	return {
		volume: volume,
		last: last,
		candleData
	};
}

/**
 * Standardises output
 *
 * @param {object} priceObj
 * @returns
 */
function cpiaPriceClean(priceObj) {
	return {
		amount: priceObj.Amount,
		id: priceObj.TradePairId,
		label: priceObj.Label,
		volume: priceObj.BaseVolume,
		price: priceObj.Price,
		timestamp: priceObj.Timestamp
	};
}

/**
 * Round down to nearest hour
 *
 * @param {any} timestamp
 * @returns
 */
function getTimestampHour(timestamp) {
	const currTime = new Date(timestamp * 1000);

	currTime.setMinutes(0, 0, 0);
	return currTime.getTime();
}
