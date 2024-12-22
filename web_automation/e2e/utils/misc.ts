/**
 * Finds the maximum numeric option from an array of options.
 * @param options - Array of option values.
 * @returns The maximum numeric option.
 */
export function findMaxOption(options: string[]): number {
  // Convert options to numbers and find the max
  return Math.max(...options.map((opt) => parseFloat(opt)).filter((num) => !isNaN(num)));
}


/**
 * Extracts all numbers from a given text.
 * @param input - The input string.
 * @returns An array of extracted numbers.
 */
export function extractAllNumbers(input: string): number[] {
  const matches = input.match(/\d+/g); // Regex to match all numbers
  return matches ? matches.map((num) => parseInt(num, 10)) : [];
}
