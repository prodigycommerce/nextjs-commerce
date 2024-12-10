import { makeApiFullUrl, prodigyFetch } from 'lib/prodigy/core';
import { TAGS } from '../constants';
import { Image, Product, ProductOption, ProductVariant } from '../types';
import { JSONObject, ParsedJSONApiData } from '../utils/json-api';
import { reshapeFeaturedImage, reshapeMoney } from './reshapers';

type ProdigyPriceRange = { minPrice?: string; maxPrice?: string };

function reshapePrice(price: string, priceRange: ProdigyPriceRange = {}) {
  return {
    maxVariantPrice: reshapeMoney(priceRange.maxPrice || price),
    minVariantPrice: reshapeMoney(priceRange.minPrice || price)
  };
}

function reshapeImage(image: JSONObject, altText: string = ''): Image {
  const url = makeApiFullUrl(image.croppedUrl as string);
  const croppingParams = image.croppingParams as JSONObject;

  return {
    url,
    altText,
    width: croppingParams?.w as number,
    height: croppingParams?.h as number
  };
}

function reshapeImages(images: JSONObject[]): Image[] {
  if (!Array.isArray(images)) {
    return [];
  }

  return images.map((image) => reshapeImage(image));
}

function collectVariants(masterVariant: JSONObject, variants: JSONObject[]): JSONObject[] {
  if (!Array.isArray(variants) || variants.length === 0) {
    if (!masterVariant) {
      return [];
    }

    return [masterVariant];
  } else {
    return variants;
  }
}

function reshapeVariants(variants: JSONObject[]): ProductVariant[] {
  if (!Array.isArray(variants)) {
    return [];
  }

  return variants.map(
    (variant) =>
      ({
        id: variant.id,
        title: variant.sku,
        availableForSale: (variant?.inventory as JSONObject)?.stock === 'in_stock',
        selectedOptions: (variant.options as Array<JSONObject>).map((option) => ({
          name: option.name,
          value: option.value
        })),
        price: reshapeMoney(variant.price as string)
      }) as unknown as ProductVariant
  );
}

function reshapeOptions(variantAttributes: JSONObject[]): ProductOption[] {
  if (!Array.isArray(variantAttributes)) {
    return [];
  }

  return variantAttributes?.map(
    (variantAttribute) =>
      ({
        id: variantAttribute.id,
        name: variantAttribute.name,
        values: (variantAttribute.options as JSONObject[])?.map((option) => option.value)
      }) as unknown as ProductOption
  );
}

function reshapeTags(tags: JSONObject[]): string[] {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags?.map((tag) => tag.name as string);
}

function reshapeProduct(product: JSONObject) {
  if (!product) {
    return undefined;
  }

  console.log(product.variants);

  return {
    id: product.id,
    handle: product.id,
    // Set to true if undefined because of different shape of index and show endpoints responses
    availableForSale: product.inStock ?? true,
    title: product.name,
    description: product.metaDescription,
    descriptionHtml: product.description,
    options: reshapeOptions(product.variantAttributes as JSONObject[]),
    priceRange: reshapePrice(product.price as string, product.priceRange as ProdigyPriceRange),
    variants: reshapeVariants(
      collectVariants(product.masterVariant as JSONObject, product.variants as JSONObject[])
    ),
    featuredImage: reshapeFeaturedImage(product.imageUrl),
    images: reshapeImages(product.images as JSONObject[]),
    seo: {
      title: product.metaTitle,
      description: product.metaDescription
    },
    tags: reshapeTags(product.tags as JSONObject[]),
    updatedAt: null
  } as unknown as Product;
}

function reshapeProducts(productsResponse: ParsedJSONApiData) {
  if (!Array.isArray(productsResponse.data)) {
    return [];
  }

  return productsResponse.data.map(reshapeProduct).filter(Boolean) as Product[];
}

export async function getProducts({
  query,
  sortKey,
  collection
}: {
  query?: string;
  sortKey?: string;
  collection?: string;
}): Promise<Product[]> {
  const response = await prodigyFetch({
    endpoint: '/api/v1/plugin/products',
    method: 'GET',
    tags: [TAGS.products],
    params: {
      sort: sortKey,
      search: query,
      category_id: collection
    }
  });

  return reshapeProducts(response);
}

export async function getCollectionProducts({
  collection
}: {
  collection: 'hidden-homepage-carousel' | 'hidden-homepage-featured-items';
}): Promise<Product[]> {
  const params = {
    'hidden-homepage-carousel': { sortKey: 'created_at' },
    'hidden-homepage-featured-items': { sortKey: 'rating' }
  }[collection];

  return getProducts(params);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const response = await prodigyFetch({
    endpoint: `/api/v1/plugin/products/${handle}`,
    method: 'GET',
    tags: [TAGS.products],
    params: {
      include:
        'images,master-variant.dimension,master-variant.inventory,variants.dimension,variants.inventory,variant-attributes.options,tags'
    }
  });

  return reshapeProduct(response.data as JSONObject);
}

export async function getProductRecommendations(id: string): Promise<Product[]> {
  const response = await prodigyFetch({
    endpoint: '/api/v1/plugin/products/related_products',
    method: 'GET',
    tags: [TAGS.products],
    params: {
      'product_ids[]': id
    }
  });

  return reshapeProducts(response);
}
