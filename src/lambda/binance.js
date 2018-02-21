import { getAllCandles } from '../binance/market';

exports.getCandles = function(event, content) {
	return getAllCandles().then(results => {
		content.succeed(results);
	});
};
