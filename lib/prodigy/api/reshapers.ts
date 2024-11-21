import { makeApiFullUrl } from 'lib/prodigy/core';
import { Image } from '../types';

const imageStub = { url: '/product-icon.png', altText: '' };

export function reshapeMoney(amount: string, currencyCode = 'USD') {
  return { amount, currencyCode };
}

export function reshapeFeaturedImage(imagePath: unknown, altText: string = ''): Image {
  if (!(typeof imagePath === 'string')) {
    return imageStub;
  }
  const url = makeApiFullUrl(imagePath);
  return { url, altText };
}
