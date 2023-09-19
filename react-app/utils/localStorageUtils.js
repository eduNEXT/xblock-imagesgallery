/**
 * Sets a key-value pair in the browser's local storage.
 *
 * @param {string} key - The key under which to store the value.
 * @param {any} value - The value to store in local storage.
 */
export const setItemLocalStorage = (key, value) => {
  const formatValue = typeof value === 'string' ? value : JSON.stringify(value);
  localStorage.setItem(key, formatValue);
}

/**
 * Retrieves a value from the browser's local storage.
 *
 * @param {string} key - The key for the value to retrieve.
 * @returns {any} The value stored in local storage, or null if the key doesn't exist.
 */
export const getItemLocalStorage = (key)  => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : data;
}
