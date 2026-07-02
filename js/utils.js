

// Category definitions
export const categories = [
  { name: 'Appetizers', key: 'Appetizer', aliases: ['Appetizers'], className: 'Appetizer', order: 1 },
  { name: 'Thai Salads', key: 'Thai Salad', aliases: ['Thai Salads'], className: 'ThaiSalads', order: 2 },
  { name: 'Soups', key: 'Soup', aliases: ['Soups'], className: 'Soup', order: 3 },
  { name: 'Thai curries', key: 'Thai curries', aliases: ['Thai Curries'], className: 'ThaiCurries', order: 4 },
  { name: 'Fish & Seafood', key: 'Fish & Seafood', aliases: ['Fish & Seafoods'], className: 'FishSeafood', order: 5 },
  { name: 'Stir-fried Dishes', key: 'Stir-fried Dish', aliases: ['Stir-fried Dishes', 'Stir‑fried Dishes', 'Stir-fried'], className: 'Stir-friedDishes', order: 6 },
  { name: 'Barbecue', key: 'Barbecue', aliases: ['Barbeque'], className: 'Barbeque', order: 7 },
  { name: 'Vegetables', key: 'Vegetable', aliases: ['Vegetables'], className: 'Vegetables', order: 8 },
  { name: 'Noodle Dishes', key: 'Noodle Dish', aliases: ['Noodle Dishes'], className: 'NoodleDishes', order: 9 },
  { name: 'Rice Dishes', key: 'Rice Dish', aliases: ['Rice Dishes'], className: 'RiceDishes', order: 10 },
  { name: 'Thai Desserts', key: 'Thai Dessert', aliases: ['Thai Desserts', 'Specialty Thai Desserts'], className: 'SpecialtyThaiDesserts', order: 11 },
  { name: 'Lunch Special', key: 'Lunch Special', aliases: ['Lunch Specials'], className: 'LunchSpecial', order: 12 },
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

export function getCategoryClassName(value) {
  const category = findCategoryByValue(value);
  if (category?.className) return category.className;
  return String(value || '').replace(/\s|(?!<a(.*)>(.*))(&amp;|&)/g, '');
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