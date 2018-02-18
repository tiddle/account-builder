import { organiseToCandles } from './time';

let collection = [];

describe('func organiseToCandles', () => {
	beforeEach(() => {
		collection = [
			{
				TradePairId: 100,
				Label: 'DOT/BTC',
				Type: 'Sell',
				Price: 10,
				Amount: 3,
				Total: 0.00144013,
				Timestamp: 1918506386
			},
			{
				TradePairId: 100,
				Label: 'DOT/BTC',
				Type: 'Sell',
				Price: 10,
				Amount: 1,
				Total: 0.00136333,
				Timestamp: 1518507812
			},
			{
				TradePairId: 100,
				Label: 'DOT/BTC',
				Type: 'Sell',
				Price: 10,
				Amount: 2,
				Total: 0.00059535,
				Timestamp: 1518506477
			},
			{
				TradePairId: 100,
				Label: 'DOT/BTC',
				Type: 'Sell',
				Price: 10,
				Amount: 3,
				Total: 0.00144013,
				Timestamp: 1518506386
			}
		];
	});

	it('should be a function', () => {
		expect(organiseToCandles).toBeInstanceOf(Function);
	});

	it('should apply the lowest price correctly', () => {
		collection[3].Price = 8;
		const output = organiseToCandles(collection, 10, 1);

		expect(output.hour[0].low.price).toEqual(8);
		expect(output.hour[0].low.amount).toEqual(3);
		expect(output.day[0].low.price).toEqual(8);
		expect(output.day[0].low.amount).toEqual(3);
	});

	it('should apply the high price correctly', () => {
		collection[3].Price = 11;
		const output = organiseToCandles(collection, 10, 1);

		expect(output.hour[0].high.price).toEqual(11);
		expect(output.hour[0].high.amount).toEqual(3);
		expect(output.day[0].high.price).toEqual(11);
		expect(output.day[0].high.amount).toEqual(3);
	});

	it('should apply the open price correctly', () => {
		collection[3].Price = 2;
		const output = organiseToCandles(collection, 10, 1);

		expect(output.hour[0].open.price).toEqual(2);
		expect(output.hour[0].open.amount).toEqual(3);
		expect(output.day[0].open.price).toEqual(2);
		expect(output.day[0].open.amount).toEqual(3);
	});

	it('should apply the close price correctly', () => {
		collection[1].Price = 2;
		const output = organiseToCandles(collection);

		expect(output.hour[0].close.price).toEqual(2);
		expect(output.hour[0].close.amount).toEqual(1);
		expect(output.day[0].close.price).toEqual(2);
		expect(output.day[0].close.amount).toEqual(1);
	});
});
