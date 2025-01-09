/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const pick = <T extends object>(object: T, keys: string[]): Partial<T> => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key as keyof T] = object[key as keyof T];
    }
    return obj;
  }, {} as Partial<T>);
};

export default pick;
