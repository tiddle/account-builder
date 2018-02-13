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
			},
			{
				TradePairId: 100,
				Label: 'DOT/BTC',
				Type: 'Sell',
				Price: 10,
				Amount: 3,
				Total: 0.00144013,
				Timestamp: 1918506386
			}
		];
	});

	it('should be a function', () => {
		expect(organiseToCandles).toBeInstanceOf(Function);
	});

	it('should apply the lowest price correctly', () => {
		collection[2].Price = 8;
        const output = organiseToCandles(collection);
        console.log(output);

		expect(output['1518505200000'].low.Price).toEqual(8);
		expect(output['1518505200000'].low.Amount).toEqual(3);
	});

	it('should apply the high price correctly', () => {
		collection[2].Price = 11;
		const output = organiseToCandles(collection);

		expect(output['1518505200000'].high.Price).toEqual(11);
		expect(output['1518505200000'].high.Amount).toEqual(3);
	});

	it('should apply the open price correctly', () => {
		collection[0].Price = 2;
		const output = organiseToCandles(collection);

		expect(output['1518505200000'].open.Price).toEqual(2);
		expect(output['1518505200000'].open.Amount).toEqual(1);
	});

	it('should apply the close price correctly', () => {
		collection[2].Price = 2;
        const output = organiseToCandles(collection);

		expect(output['1518505200000'].close.Price).toEqual(2);
		expect(output['1518505200000'].close.Amount).toEqual(3);
	});
});
