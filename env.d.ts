/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

import type {HydrogenEnv} from '@shopify/hydrogen';

/**
 * Environment variables interface
 * Extends HydrogenEnv from @shopify/hydrogen and adds custom variables
 */
interface Env extends HydrogenEnv {
  // Required variables
  /** Secret used to sign session cookies. Required for app to work. */
  SESSION_SECRET: string;
  
  /** Public store domain (e.g., 'your-store.myshopify.com') */
  PUBLIC_STORE_DOMAIN: string;
  
  /** Public Storefront API token */
  PUBLIC_STOREFRONT_API_TOKEN: string;
  
  // Optional variables
  /** Storefront API version (e.g., '2025-01'). Optional, defaults to latest. */
  PUBLIC_STOREFRONT_API_VERSION?: string;
  
  /** Custom header menu handle. Optional, defaults to 'main-menu'. */
  PUBLIC_HEADER_MENU_HANDLE?: string;
  
  /** Custom footer menu handle. Optional, defaults to 'footer'. */
  PUBLIC_FOOTER_MENU_HANDLE?: string;
}
