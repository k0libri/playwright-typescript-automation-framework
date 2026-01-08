/**
 * Product API Payloads - Data structure builders for product operations
 */

/**
 * Build search product payload object
 */
export function buildSearchProductPayload(searchTerm: string) {
  return {
    search_product: searchTerm,
  };
}
