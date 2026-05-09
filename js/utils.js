

// Category definitions
export const categories = [
  { name: 'Appetizers', key: 'Appetizer', aliases: ['Appetizers'], order: 1 },
  { name: 'Thai Salads', key: 'Thai Salad', aliases: ['Thai Salads'], order: 2 },
  { name: 'Soups', key: 'Soup', aliases: ['Soups'], order: 3 },
  { name: 'Thai curries', key: 'Thai curries', aliases: ['Thai Curries'], order: 4 },
  { name: 'Fish & Seafood', key: 'Fish & Seafood', aliases: ['Fish & Seafoods'], order: 5 },
  { name: 'Stir-fried Dishes', key: 'Stir-fried Dish', aliases: ['Stir-fried Dishes', 'Stir‑fried Dishes', 'Stir-fried'], order: 6 },
  { name: 'Barbecue', key: 'Barbecue', aliases: ['Barbeque'], order: 7 },
  { name: 'Vegetables', key: 'Vegetable', aliases: ['Vegetables'], order: 8 },
  { name: 'Noodle Dishes', key: 'Noodle Dish', aliases: ['Noodle Dishes'], order: 9 },
  { name: 'Rice Dishes', key: 'Rice Dish', aliases: ['Rice Dishes'], order: 10 },
  { name: 'Thai Desserts', key: 'Thai Dessert', aliases: ['Thai Desserts', 'Specialty Thai Desserts'], order: 11 },
  { name: 'Lunch Special', key: 'Lunch Special', aliases: ['Lunch Specials'], order: 12 },
];

function normalizeCategory(value) {
  return String(value || '')
    .replace(/\u2011/g, '-')
    .trim()
    .toLowerCase();
}

export function findCategoryByValue(value) {
  const normalizedValue = normalizeCategory(value);

  return categories.find(category =>
    [category.key, ...(category.aliases || [])].some(candidate => normalizeCategory(candidate) === normalizedValue)
  );
}



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