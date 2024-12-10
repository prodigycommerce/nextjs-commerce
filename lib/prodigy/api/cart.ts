import { TAGS } from '../constants';
import { makeCheckoutUrl, prodigyFetch } from '../core';
import { Cart, CartItem } from '../types';
import { JSONObject } from '../utils/json-api';
import { reshapeFeaturedImage, reshapeMoney } from './reshapers';

function reshapeLineItem(lineItem: JSONObject): CartItem {
  const options = Array.isArray(lineItem.options) ? (lineItem.options as JSONObject[]) : [];

  return {
    id: lineItem.id,
    quantity: lineItem.quantity,
    cost: {
      totalAmount: reshapeMoney(lineItem.total as string)
    },
    merchandise: {
      id: lineItem.variantId,
      title: options.map((option) => option.value as string).join(' | '),
      selectedOptions: options,
      product: {
        id: lineItem.productId,
        handle: lineItem.productId,
        title: lineItem.name,
        featuredImage: reshapeFeaturedImage(lineItem.imageUrl)!
      }
    }
  } as CartItem;
}

function reshapeCart(cart: JSONObject): Cart | undefined {
  if (!cart) {
    return undefined;
  }
  const lineItems = cart.lineItems as JSONObject[];

  return {
    id: cart.token,
    checkoutUrl: makeCheckoutUrl(cart.id as string, cart.token as string),
    cost: {
      totalAmount: reshapeMoney(cart.total as string),
      // Subtotal and tax are not exposed by Prodigy API at storefront
      subtotalAmount: reshapeMoney('0.0'),
      totalTaxAmount: reshapeMoney('0.0')
    },
    lines: lineItems?.map(reshapeLineItem) || [],
    totalQuantity: lineItems?.reduce((acc, lineItem) => acc + Number(lineItem.quantity), 0) || 0
  } as Cart;
}

export async function getCart(cartToken?: string): Promise<Cart | undefined> {
  if (!cartToken) {
    return undefined;
  }

  const response = await prodigyFetch({
    endpoint: `/api/v1/plugin/orders/${cartToken}`,
    method: 'GET',
    tags: [TAGS.cart],
    params: {
      include: 'line-items'
    },
    cache: 'no-store'
  });

  return reshapeCart(response.data as JSONObject);
}

// Prodigy API does not support creating empty cart, cart is created by adding first line item to it
export function createCart() {}

export async function addToCart(
  cartToken: string | undefined,
  lines: { variantId: string; quantity: number }[]
): Promise<Cart | undefined> {
  const response = await prodigyFetch({
    endpoint: '/api/v1/plugin/cart',
    method: 'PATCH',
    params: {
      order_token: cartToken,
      line_items: lines.map((line) => ({ variant_id: line.variantId, quantity: line.quantity })),
      include: 'line-items'
    },
    cache: 'no-store'
  });

  return reshapeCart(response.data as JSONObject);
}

export async function removeFromCart(cartToken: string, lineId: string): Promise<void> {
  await prodigyFetch({
    endpoint: `/api/v1/plugin/cart/line_items/${lineId}`,
    method: 'DELETE',
    params: {
      order_token: cartToken
    },
    cache: 'no-store'
  });
}

export async function updateCart(
  cartToken: string,
  line: { id: string; variantId: string; quantity: number }
): Promise<void> {
  await prodigyFetch({
    endpoint: `/api/v1/plugin/cart/line_items/${line.id}`,
    method: 'PATCH',
    params: {
      order_token: cartToken,
      line_item: { variant_id: line.variantId, quantity: line.quantity }
    },
    cache: 'no-store'
  });
}

export async function deleteCart(cartToken: string): Promise<void> {
  const response = await prodigyFetch({
    endpoint: `/api/v1/plugin/orders/${cartToken}`,
    method: 'DELETE',
    tags: [TAGS.cart],
    params: {
      include: 'line-items'
    },
    cache: 'no-store'
  });
}
