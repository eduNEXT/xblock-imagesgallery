export const setItemLocalStorage = (key, value) => {
  const formatValue = typeof value === 'string' ? value : JSON.stringify(value);
  localStorage.setItem(key, formatValue);
}

export const getItemLocalStorage = (key)  => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : data;
}
