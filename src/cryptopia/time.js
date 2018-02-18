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
	const candles = collection.reduceRight(
		(acc, curr, index) => {
			// Hourly Candles
			const hourTimestamp = getTimestampHour(curr.Timestamp);
			acc.hourly[hourTimestamp] = setTimeData(
				acc.hourly[hourTimestamp] || {},
				curr
			);

			// Daily Candles
			const dayTimestamp = getTimestampDay(curr.Timestamp);
			acc.daily[dayTimestamp] = setTimeData(
				acc.daily[dayTimestamp] || {},
				curr
			);

			return acc;
		},
		{ hourly: [], daily: [] }
	);

	// This fixes the weird output and turns it into a proper array
	const hourKeys = Object.keys(candles.hourly);
	const hourCandleData = hourKeys.map(key =>
		cleanupCandles(key, candles.hourly)
	);
	const dailyKeys = Object.keys(candles.daily);
	const dayCandleData = dailyKeys.map(key =>
		cleanupCandles(key, candles.daily)
	);

	let output = {
		volume: volume,
		last: last,
		label: hourCandleData[0].open.label,
		id: hourCandleData[0].open.label,
		hour: hourCandleData,
		day: dayCandleData
	};

	return output;
}

function cleanupCandles(timestamp, candles) {
	return {
		low: cpiaPriceClean(candles[timestamp].low),
		high: cpiaPriceClean(candles[timestamp].high),
		open: cpiaPriceClean(candles[timestamp].open),
		close: cpiaPriceClean(candles[timestamp].close)
	};
}

function setTimeData(timeStampData, priceDataOriginal) {
	const output = {};
	const priceData = Object.assign({}, priceDataOriginal);

	output.low = timeStampData.low || priceData;
	output.high = timeStampData.high || priceData;
	output.open = timeStampData.open || priceData;

	if (output.low.Price > priceData.Price) {
		output.low = priceData;
	}

	if (output.high.Price < priceData.Price) {
		output.high = priceData;
	}

	output.close = priceData;

	return output;
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

/**
 * Round down to nearest day
 *
 * @param {any} timestamp
 * @returns
 */
function getTimestampDay(timestamp) {
	const currTime = new Date(timestamp * 1000);

	currTime.setHours(0, 0, 0, 0);
	return currTime.getTime();
}
