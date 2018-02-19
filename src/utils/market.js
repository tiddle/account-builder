import axios from 'axios';

/**
 * Get markets utility function
 *
 * @param {string} url
 * @param {function} marketMorphFunc
 */
export function marketUtil(url, marketMorphFunc) {
	return axios
		.get(url)
		.then(marketMorphFunc)
		.catch(err => {
			console.error('getMarkets', err);
			throw new Error(err);
		});
}
