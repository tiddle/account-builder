var indexModule = require('../lambda-dist/index.js');

var fakeLambdaContext = {
	succeed: function succeed(results) {
		console.log(results);
		process.exit(0);
	}
};

indexModule.hello({ name: 'bob' }, fakeLambdaContext);
