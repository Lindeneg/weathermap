/**
 * @template T
 * @typedef {[Error | null, T | null]} GetReturn */
/** @typedef {[Error | null, {lastID: number, changes: number}]} RunReturn */

export const emptyResult = () => ({ lastID: -1, changes: 0 });

/**
 * @param {Object} obj
 * @returns {boolean} */
export const hasKeys = (obj) => {
    try {
        return Object.keys(obj).length > 0;
    } catch (err) {
        console.log(err);
    }
    return false;
};

/**
 * @template T
 * @param {[Error | null, T]} result
 * @returns {[Error | null, T | null]}*/
export const handleGetResult = ([error, target]) => {
    if (error) {
        return [error, null];
    }
    if (hasKeys(target)) {
        return [null, target];
    }
    return [null, null];
};
