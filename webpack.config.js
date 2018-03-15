var path = require('path');
const defaultOutput = {
	entry: './src/lambda/binance.js',
	output: {
		path: path.resolve(__dirname, 'lambda-dist'),
		filename: 'binance.js',
		library: 'index',
		libraryTarget: 'commonjs2'
	},
	target: 'node',
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			}
		]
	}
};

const binance = Object.assign({}, defaultOutput);
const cryptopia = Object.assign({}, defaultOutput, {
	entry: './src/lambda/cryptopia.js',
	output: {
		filename: 'cryptopia.js'
	}
});

const ccxt = {
	entry: './src/markets/test.js',
	output: {
		path: path.resolve(__dirname, 'lambda-dist'),
		filename: 'market.js'
	},
	target: 'node',
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			}
		]
	}
};

module.exports = [ccxt];

// module.exports = defaultOutput;
