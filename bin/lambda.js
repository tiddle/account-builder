var indexModule = require('../lambda-dist/binance.js');

var fakeLambdaContext = {
	succeed: function succeed(results) {
		console.log(results);
		process.exit(0);
	}
};

indexModule.getCandles({ name: 'bob' }, fakeLambdaContext);
