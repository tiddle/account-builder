import { getHighLow, calculateChange } from './price';

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
				}
			},
			{
				low: {
					price: 1
				},
				high: {
					price: 3
				}
			},
			{
				low: {
					price: 0
				},
				high: {
					price: 2
				}
			},
			{
				low: {
					price: 1
				},
				high: {
					price: 2
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
});
