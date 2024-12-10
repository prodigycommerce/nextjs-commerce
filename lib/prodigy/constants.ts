export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: 'created_at' | 'rating' | 'price' | '-price' | 'name';
};

export const defaultSort: SortFilterItem = {
  title: 'Latest arrivals',
  slug: null,
  sortKey: 'created_at'
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  { title: 'Top Rated', slug: 'rating', sortKey: 'rating' },
  { title: 'Name', slug: 'name', sortKey: 'name' },
  { title: 'Price: Low to high', slug: 'price', sortKey: 'price' },
  { title: 'Price: High to low', slug: '-price', sortKey: '-price' }
];

export const TAGS = {
  collections: 'collections',
  products: 'products',
  cart: 'cart'
};

export const HIDDEN_PRODUCT_TAG = 'nextjs-frontend-hidden';
export const DEFAULT_OPTION = 'Default Title';
