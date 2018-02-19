import { getHighLow, calculateChange, calculateStats } from './price';

let collection = [];

describe('price utils', () => {
	beforeEach(() => {
		collection = [
			{
				low: {
					price: 1
				},
				high: {
					price: 2
				},
				open: {
					price: 1
				}
			},
			{
				low: {
					price: 1
				},
				high: {
					price: 3
				},
				open: {
					price: 1
				}
			},
			{
				low: {
					price: 0
				},
				high: {
					price: 2
				},
				open: {
					price: 1
				}
			},
			{
				low: {
					price: 1
				},
				high: {
					price: 2
				},
				open: {
					price: 1
				}
			}
		];
	});

	describe('getHighLow ', () => {
		it('should be a function', () => {
			expect(getHighLow).toBeInstanceOf(Function);
		});

		it('should get the high and low from an array', () => {
			expect(getHighLow(collection).low).toEqual(0);
			expect(getHighLow(collection).high).toEqual(3);
			expect(getHighLow([]).high).toEqual(0);
			expect(getHighLow([]).low).toEqual(9999999999);
		});
	});

	describe('calculateChange', () => {
		it('should be a function', () => {
			expect(calculateChange).toBeInstanceOf(Function);
		});

		it('should calculate the change correctly', () => {
			expect(calculateChange(1, 2)).toEqual(0.5);
			expect(calculateChange(5, 1)).toEqual(4);
		});
	});

	describe('calculateStats', () => {
		it('should be a function', () => {
			expect(calculateStats).toBeInstanceOf(Function);
		});

		it('should calculate the average price', () => {
			const output = calculateStats(collection, 'label', 'id');
			expect(output.averagePrice).toEqual('1.5');
		});

		it('should output the correct label and id', () => {
			const rand = Math.random().toString();
			const output = calculateStats(collection, rand, rand);
			expect(output.id).toEqual(rand);
			expect(output.label).toEqual(rand);
		});

		it('should output average bounce', () => {
			const output = calculateStats(collection, 'labe', 'id');
			expect(output.averageBounce).toEqual('66.7%');
		});

		it('should output the correct amount of spikes', () => {
			const output = calculateStats(collection, 'labe', 'id');
			expect(output.spikes.length).toEqual(4);
		});

		it('should output the correct amount of drops', () => {
			const output = calculateStats(collection, 'labe', 'id');
			expect(output.drops.length).toEqual(1);
		});
	});
});
