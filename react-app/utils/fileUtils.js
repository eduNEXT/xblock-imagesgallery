
/**
 * Converts a file size in bytes to a human-readable format with the appropriate unit.
 * This function will be temporary
 *
 * @param {number} bytes - The file size in bytes to be converted.
 * @param {number} [decimals=2] - The number of decimal places to round the result to (default is 2).
 * @returns {string} A string representing the file size in a human-readable format (e.g., "2.56 MiB").
 */
export const sizeFileFormat = (bytes, decimals = 2) =>  {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
