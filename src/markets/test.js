import ccxt from 'ccxt';

let hitbtc = new ccxt.hitbtc2();
const markets = hitbtc.loadMarkets();
markets.then(result => {
	console.log(result);
});
// hitbtc
// 	.fetchOHLCV('ETH/BTC', '1h')
// 	.then(result => {
// 		console.log(result);
// 	})
// 	.catch(err => {
// 		console.log(err);
// 	});
