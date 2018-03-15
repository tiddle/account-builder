import { getAllCandles } from '../cryptopia/market';

exports.getCandles = function(aa) {
	return getAllCandles().then(results => {
		console.log(results);
	});
};
