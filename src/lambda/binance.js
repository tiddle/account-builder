import { createCandles } from '../binance/market';

exports.getCandles = function(event, content, callback) {
	return createCandles().then(results => {
		content.succeed(results);
	});
};
