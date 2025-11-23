import {Suspense, useState} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {SearchPopup} from '~/components/SearchPopup';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <NavLink
              prefetch="intent"
              to="/"
              className="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors no-underline"
              end
            >
              {shop.name}
            </NavLink>

            {/* Desktop Menu */}
            <HeaderMenu
              menu={menu}
              viewport="desktop"
              primaryDomainUrl={header.shop.primaryDomain.url}
              publicStoreDomain={publicStoreDomain}
            />

            {/* CTAs */}
            <HeaderCtas
              isLoggedIn={isLoggedIn}
              cart={cart}
              onSearchClick={() => setIsSearchOpen(true)}
            />
          </div>
        </div>
      </header>

      {/* Search Popup */}
      <SearchPopup isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const {close} = useAside();

  const menuItems = (menu || FALLBACK_HEADER_MENU).items;

  if (viewport === 'mobile') {
    return (
      <nav className="flex flex-col gap-4" role="navigation">
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          className="text-gray-700 hover:text-purple-600 font-medium transition-colors no-underline px-3 py-2 rounded-md hover:bg-gray-50"
          to="/"
        >
          Home
        </NavLink>
        {menuItems.map((item) => {
          if (!item.url) return null;

          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          return (
            <NavLink
              end
              key={item.id}
              onClick={close}
              prefetch="intent"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors no-underline px-3 py-2 rounded-md hover:bg-gray-50"
              to={url}
            >
              {item.title}
            </NavLink>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="hidden md:flex items-center gap-1" role="navigation">
      {menuItems.map((item) => {
        if (!item.url) return null;

        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            className={({isActive, isPending}) =>
              `px-4 py-2 text-sm font-medium rounded-md transition-colors no-underline ${
                isActive
                  ? 'text-purple-600 bg-purple-50'
                  : isPending
                    ? 'text-gray-400'
                    : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
              }`
            }
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
  onSearchClick,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'> & {onSearchClick: () => void}) {
  return (
    <nav className="flex items-center gap-4" role="navigation">
      <HeaderMenuMobileToggle />
      <NavLink
        prefetch="intent"
        to="/account"
        className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors no-underline px-3 py-2 rounded-md hover:bg-gray-50"
      >
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle onSearchClick={onSearchClick} />
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="md:hidden p-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
      onClick={() => open('mobile')}
      aria-label="Open menu"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
}

function SearchToggle({onSearchClick}: {onSearchClick: () => void}) {
  return (
    <button
      className="p-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
      onClick={onSearchClick}
      aria-label="Search"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      className="relative p-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
      aria-label="Open cart"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      {count !== null && count > 0 && (
        <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

