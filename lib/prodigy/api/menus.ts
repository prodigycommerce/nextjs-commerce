import { TAGS } from '../constants';
import { prodigyFetch } from '../core';
import { Menu, Page } from '../types';

const aboutPageBody = `<p>This website is built with <a href="https://github.com/prodigycommerce/nextjs-commerce" title="Prodigy Next.js Commerce">Prodigy Next.js Commerce</a>, which is a ecommerce template for creating a Prodigy Commerce storefront.&nbsp;</p>
<p>Support for real-world commerce features including:&nbsp;</p>
<ul>
<li>Out of stocks</li>
<li>Cross variant / option availability (aka. Amazon style)</li>
<li>Hidden products</li>
<li>Dynamically driven content and features via Prodigy Commerce</li>
<li>Seamless and secure checkout via <a href="https://prodigycommerce.com" title="Prodigy Commerce">Prodigy Commerce</a>
</li>
<li>And more!</li>
</ul>
<p>This template also allows us to highlight newer Next.js features including:&nbsp;</p>
<ul>
<li>Next.js App Router</li>
<li>Optimized for SEO using Next.js's Metadata</li>
<li>React Server Components (RSCs) and Suspense</li>
<li>Server Actions&nbsp;for mutations</li>
<li>Edge runtime</li>
<li>New Next.js 13 fetching and caching paradigms</li>
<li>Dynamic OG images</li>
<li>Styling with Tailwind CSS</li>
<li>Automatic light/dark mode based on system settings</li>
<li>And more!</li>
</ul>`;
const termsPageBody =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nam libero justo laoreet sit amet cursus sit. Dictumst quisque sagittis purus sit amet volutpat consequat. Egestas diam in arcu cursus euismod. Sed faucibus turpis in eu mi bibendum. Consectetur libero id faucibus nisl. Quisque id diam vel quam elementum. Eros donec ac odio tempor orci dapibus ultrices. Turpis tincidunt id aliquet risus. Pellentesque eu tincidunt tortor aliquam nulla facilisi cras fermentum odio.';

const staticPages = {
  about: {
    id: '1',
    title: 'About',
    handle: 'about',
    body: aboutPageBody,
    bodySummary: `${aboutPageBody.slice(0, 100)}...`,
    createdAt: '2024-09-25T11:14:47.455Z',
    updatedAt: '2024-09-25T11:14:47.455Z'
  },
  'terms-conditions': {
    id: '1',
    title: 'Terms & Conditions',
    handle: 'terms-conditions',
    body: termsPageBody,
    bodySummary: `${termsPageBody.slice(0, 100)}...`,
    createdAt: '2024-09-25T11:14:47.455Z',
    updatedAt: '2024-09-25T11:14:47.455Z'
  }
};

export async function getMenu(handle: string): Promise<Menu[]> {
  if (handle === 'next-js-frontend-header-menu') {
    const response = await prodigyFetch({
      endpoint: '/api/v1/plugin/categories',
      method: 'GET',
      tags: [TAGS.collections],
      params: { limit: '2' }
    });

    if (!Array.isArray(response.data)) {
      return [];
    }

    return [
      {
        title: 'All',
        path: '/search'
      },
      ...response.data.map((collection) => ({
        title: collection.name as string,
        path: `/search/${collection.id}`
      }))
    ];
  }

  if (handle === 'next-js-frontend-footer-menu') {
    return [
      {
        title: 'Home',
        path: '/'
      },
      ...Object.values(staticPages).map((page) => ({
        title: page.title,
        path: `/${page.handle}`
      }))
    ];
  }

  return [];
}

export async function getPage(handle: string): Promise<Page> {
  if (!Object.keys(staticPages).includes(handle)) {
    throw new Error('Page not found');
  }
  return staticPages[handle as keyof typeof staticPages];
}

export async function getPages(): Promise<Page[]> {
  return Object.values(staticPages);
}
