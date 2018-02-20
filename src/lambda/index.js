import { getMarkets, getPairPrices } from '../cryptopia/market';
import { getHighLow } from '../utils/price';

exports.hello = function(aa) {
	getMarkets()
		.then(markets => {
			const pp = markets
				.slice(0, 10) // only the first 10
				.filter(market => market.volume > 1) // only those with volumes
				.map(market => {
					return getPairPrices(market.id, market.volume, market.last);
				});

			Promise.all(pp).then(aa => {
				console.log(aa);
			});
		})
		.catch(err => {
			console.log(err);
		});
};
