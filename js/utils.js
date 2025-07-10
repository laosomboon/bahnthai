

// Category definitions
export const categories = [
  { name: "Appetizers", key: "Appetizer", order: 1 },
  { name: "Barbeque", key: "Barbeque", order: 4 },
  { name: "Fish & Seafoods", key: "Fish & Seafood", order: 6 },
  { name: "Lunch Specials", key: "Lunch Special", order: 10 },
  { name: "Noodle Dishes", key: "Noodle Dishes", order: 8 },
  { name: "Rice Dishes", key: "Rice Dishes", order: 9 },
  { name: "Soups", key: "Soup", order: 2 },
  { name: "Thai Desserts", key: "Specialty Thai Desserts", order: 11 },
  { name: "Stir‑fried Dishes", key: "Stir‑fried Dishes", order: 5 },
  { name: "Thai curries", key: "Thai Curries", order: 4 },
  { name: "Thai Salads", key: "Thai Salads", order: 3 },
  { name: "Vegetable", key: "Vegetables", order: 7 },
];



export function formatPrice(price) {
  if (typeof price !== 'number') {
    // Try to convert price to number
    price = Number(price);
    if (isNaN(price)) {
      throw new Error('Invalid price value');
    }
  }
  return `$${price.toFixed(2)}`;
}