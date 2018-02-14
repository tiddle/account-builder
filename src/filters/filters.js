/**
 * Filter for price pair average bounces
 * 
 * @export
 * @param {array} collection 
 * @param {number} [minBounce=10] 
 * @returns {array}
 */
export function bounce(collection, minBounce = 10) {
    return collection.reduce((acc, curr) => {
        if(curr.averageBounce > (minBounce/100)) {
            acc.push(curr);
        }

        return acc;
    }, []);
}