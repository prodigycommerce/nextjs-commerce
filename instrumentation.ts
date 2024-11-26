import { getBaseUrl } from 'lib/getBaseUrl';
import { apiKey, prodigyFetch } from 'lib/prodigy/core';
import { JSONObject } from 'lib/prodigy/utils/json-api';

const STORE_SETTINGS = {
  pluginType: 'custom',
  url: getBaseUrl(),
  productPagePath: '/product',
  categoryPagePath: '/search',
  productsCallbackPath: '/api/revalidate/products',
  categoriesCallbackPath: '/api/revalidate/collections',
  cacheResetCallbackPath: '/api/revalidate'
};

export async function register() {
  console.log('[INSTRUMENTATION] Checking Prodigy store connection...');
  try {
    const storeSettingsResponse = await prodigyFetch({
      endpoint: '/api/v1/plugin/settings',
      method: 'GET'
    });
    const storeSettings = storeSettingsResponse?.data as JSONObject | undefined;

    if (storeSettings && storeSettings.pluginType !== STORE_SETTINGS.pluginType) {
      throw new Error('Store was set up with other plugin type.');
    }

    if (!storeSettings?.connected) {
      console.log('[INSTRUMENTATION] Connecting to store...');
      await prodigyFetch({
        endpoint: '/api/v1/plugin/connection',
        method: 'POST',
        params: {
          plugin_type: STORE_SETTINGS.pluginType,
          api_key: apiKey,
          url: STORE_SETTINGS.url,
          product_page_path: STORE_SETTINGS.productPagePath,
          category_page_path: STORE_SETTINGS.categoryPagePath,
          products_callback_path: STORE_SETTINGS.productsCallbackPath,
          categories_callback_path: STORE_SETTINGS.categoriesCallbackPath,
          cache_reset_callback_path: STORE_SETTINGS.cacheResetCallbackPath
        }
      });
      console.log('[INSTRUMENTATION] OK');
      return;
    }
    if (!checkStoreSettings(storeSettings)) {
      console.log('[INSTRUMENTATION] Updating store settings...');
      await prodigyFetch({
        endpoint: '/api/v1/plugin/connection',
        method: 'PUT',
        params: {
          plugin_type: STORE_SETTINGS.pluginType,
          url: STORE_SETTINGS.url,
          product_page_path: STORE_SETTINGS.productPagePath,
          category_page_path: STORE_SETTINGS.categoryPagePath,
          products_callback_path: STORE_SETTINGS.productsCallbackPath,
          categories_callback_path: STORE_SETTINGS.categoriesCallbackPath,
          cache_reset_callback_path: STORE_SETTINGS.cacheResetCallbackPath
        }
      });
      console.log('[INSTRUMENTATION] OK');
      return;
    }

    console.log('[INSTRUMENTATION] Connection seems alright');
  } catch (error) {
    console.log('[INSTRUMENTATION] Connection to store failed:');
    throw error;
  }
}

function checkStoreSettings(storeSettings: JSONObject) {
  const settingKeys = Object.keys(STORE_SETTINGS) as (keyof typeof STORE_SETTINGS)[];
  return settingKeys.every(
    (settingKey) => STORE_SETTINGS[settingKey] === storeSettings[settingKey]
  );
}
