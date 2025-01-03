import { faker } from '@faker-js/faker';

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

/**
 * Extracts a number inside parentheses from a given text.
 * @param input - The input string.
 * @returns The extracted number or null if not found.
 */
export function extractNumberFromText(input: string): number {
  const match = input.match(/(\d+)/); // Regex to match a number inside parentheses
  return match ? parseInt(match[1], 10) : 0;
}

interface UserData {
  name: string;
  phone: string;
  zipcode: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

export function generateUserData() : UserData {
  return {
    name: faker.person.fullName(),
    phone: faker.string.numeric(10),
    zipcode: faker.location.zipCode().split('-')[0],
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    country: faker.location.country()
  };

}
