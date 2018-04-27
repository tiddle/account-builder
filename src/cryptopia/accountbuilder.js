import ccxt from 'ccxt';
import { getAllCandles, formatForTable } from '../api-translate/api-translate'


function getExchange() {
	return new ccxt.cryptopia();
}

export async function getAccountBuildersStreamable() {
	const candles = await getAllCandles(getExchange);

	return candles.map(pairPrice => {
		return pairPrice.then(formatForTable);
	});
}

