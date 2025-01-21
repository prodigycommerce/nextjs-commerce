import type { Metadata } from 'next';

import Prose from 'components/prose';

export const metadata: Metadata = {
  title: 'About',
  description: 'Prodigy Commerce storefront template for Vercel',
  openGraph: {
    title: 'About',
    description: 'Prodigy Commerce storefront template for Vercel',
    type: 'article'
  }
};

export default async function Page() {
  return (
    <>
      <h1 className="mb-8 text-5xl font-bold">About</h1>
      <Prose className="mb-8">
        <div>
          <p>
            This website is built with{' '}
            <a
              href="https://github.com/prodigycommerce/nextjs-commerce"
              title="Prodigy Next.js Commerce"
            >
              Prodigy Next.js Commerce
            </a>
            , which is a ecommerce template for creating a Prodigy Commerce storefront.&nbsp;
          </p>
          <p>Support for real-world commerce features including:&nbsp;</p>
          <ul>
            <li>Out of stocks</li>
            <li>Cross variant / option availability (aka. Amazon style)</li>
            <li>Hidden products</li>
            <li>Dynamically driven content and features via Prodigy Commerce</li>
            <li>
              Seamless and secure checkout via{' '}
              <a href="https://prodigycommerce.com" title="Prodigy Commerce">
                Prodigy Commerce
              </a>
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
          </ul>
        </div>
      </Prose>
      <p className="text-sm italic">
        {`This document was last updated on ${new Intl.DateTimeFormat(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(new Date('2024-09-25T11:14:47.455Z'))}.`}
      </p>
    </>
  );
}
