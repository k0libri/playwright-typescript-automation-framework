/**
 * Product API Payloads - Data structure builders for product operations
 */

/**
 * Build search product payload from search term
 * @param searchTerm - The search query string
 * @returns Payload object formatted for product search API request
 */
export function buildSearchProductPayload(searchTerm: string) {
  return {
    search_product: searchTerm,
  };
}
