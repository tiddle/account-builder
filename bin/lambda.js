var indexModule = require('../lambda-dist/binance.js');

var fakeLambdaContext = function(results) {
	console.log(results);
	process.exit(0);
};

indexModule.getCandles({ name: 'bob' }, null, fakeLambdaContext);
