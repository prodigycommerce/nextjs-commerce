[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fprodigycommerce%2Fnextjs-commerce&project-name=commerce&repo-name=commerce&demo-title=Next.js%20Commerce&env=COMPANY_NAME,PRODIGY_API_DOMAIN,PRODIGY_STORE_TOKEN,SITE_NAME,TWITTER_CREATOR,TWITTER_SITE)

# Next.js Commerce for Prodigy Commerce

A high-perfomance, server-rendered Next.js App Router ecommerce application template to use with Prodigy Commerce.

This template uses React Server Components, Server Actions, `Suspense`, `useOptimistic`, and more.

<h3 id="v1-note"></h3>

> Note: You can also refer to Vercel's original Next.js Commerce [here](https://github.com/vercel/commerce/tree/v1)

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js Commerce. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables) for this, but a `.env` file is all that is necessary.

> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control your Prodigy Commerce store.

1. Install Vercel CLI: `npm i -g vercel`
2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`
3. Download your environment variables: `vercel env pull`

```bash
pnpm install
pnpm dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

## Vercel, Next.js Commerce, and Prodigy Commerce Integration Guide

To deploy your Prodigy Commerce storefront on the Vercel platform you need to:
1. [Log into Prodigy Commerce account](https://app.prodigycommerce.com/login).
2. Select your store in the stores list.
3. Go to [Settings](https://pdemo.prodigycommerce.com/settings) in the navigation bar.
4. If your store is not connected you'll see "Want to connect custom plugin?" link, click at that link. If your store is connected you'll need to disconnect it first.
5. "Store Token" modal should open and you would be able to copy the token. Never share this token to anyone except highly trusted parties. This token grants almost full access to your store.
6. [Log into your Vercel account](https://vercel.com) and go to the Dashboard.
7. Click on "Add New..." button and select "Project" in the dropdown.
8. In "Clone Template" section find this template by clicking "Browse All Templates" and searching. Then select it.
9. If you could not find it there click at "Import Third-Party Git Repository" in the "Import Git Repository" section. then paste url of this repository into a field and click "Continue".
10. Select your team and fill in name of your project.
11. Click on "Environment Variables" to open a section.
12. In there add `PRODIGY_STORE_TOKEN` variable with value from step 5.
13. Add `PRODIGY_API_DOMAIN` variable with value `https://api.prodigycommerce.com`.
14. Add `PRODIGY_CLIENT_DOMAIN` variable with value `https://{your-store-name}.prodigycommerce.com`.
15. Add `SITE_NAME` variable with name of your choice.
16. Add other environment variables you see fit. Refer to `.env.example` for the list.
17. Click "Deploy" button and you done. For any other question regarding Vercel platform refer to [Vercel Docs](https://vercel.com/docs).
