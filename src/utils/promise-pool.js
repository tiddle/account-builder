function getRandomString() {
    return Math.random().toString(36).substring(2, 15);
}

export default class PromisePool {
    constructor() {
        /**
         * @type {Object.<string, Promise>}
         */
        this.items = {};
        /**
         * @type {Array.<Function>}
         */
        this.subscriptionCallbacks = [];
        /**
         * @type {Array.<string>}
         */
        this.settledItems = [];
    }

    /**
     * @param {function} callback
     */
    subscribe(callback) {
        this.subscriptionCallbacks.push(callback);
    }

    /**
     * @param {string} actionType
     * @param {Promise} item
     * @param {string} itemId
     * @param {Object.<string, Promise>} items
     */
    doCallbacks(actionType, item, itemId, items) {
        this.subscriptionCallbacks.forEach(cb => {
            cb(actionType, item, itemId, items);
        });
    }

    /**
     * @param {*} data
     * @param {string} id
     * @private
     */
    _handleSettledItem(data, id) {
        /**
         * If the instance has been `terminate()`-ed between the
         * time the promise was invoked and now (the promise being
         * settled), then we need to make sure we don't continue.
         */
        if (!this.items[id]) {
            return;
        }

        this.doCallbacks('settled', data, id, this.items);
        this.settledItems.push(id);

        if (this.haveAllSettled()) {
            this.doCallbacks('finalized', data, id, this.items);
        }
    }

    haveAllSettled() {
        return Object.keys(this.items).length === this.settledItems.length;
    }

    /**
     * @param {Promise} promise
     */
    add(promise) {
        const id = getRandomString();
        this.items[id] = promise;

        this.doCallbacks('added', promise, id, this.items);

        promise
            .then(
                /**
                 * @param {*} value
                 */
                value => this._handleSettledItem(value, id)
            )
            .catch(
                /**
                 * @param {Error} err
                 */
                err => this._handleSettledItem(err, id)
            )
    }

    terminate() {
        this.items = {};
        this.subscriptionCallbacks.length = 0;
        this.settledItems.length = 0;
    }
}