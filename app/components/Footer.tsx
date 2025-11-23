import {Suspense, useState} from 'react';
import type {FormEvent} from 'react';
import {Await, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

/**
 * Footer Component - Modern Design
 * 
 * Features:
 * - Logo section with newsletter below
 * - Social media icons
 * - Quick links (products, collections, etc.)
 * - Policies near copyright
 * - Responsive layout
 * - Elegant light background matching Header design system
 */
export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="bg-white border-t border-gray-200 mt-auto shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {/* Logo Section with Newsletter */}
                <div className="lg:col-span-1 flex flex-col">
                  <NavLink
                    prefetch="intent"
                    to="/"
                    className="text-2xl font-bold text-gray-900 hover:text-purple-600 transition-colors no-underline inline-block mb-4"
                    end
                  >
                    {header.shop.name}
                  </NavLink>
                  {header.shop.description && (
                    <p className="text-sm text-gray-600 mb-6">
                      {header.shop.description}
                    </p>
                  )}
                  
                  {/* Newsletter Section */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 mt-8">
                      Newsletter
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Subscribe to get updates on new products and special offers.
                    </p>
                    <NewsletterForm />
                  </div>
                </div>

                {/* Quick Links Section */}
                <div className="lg:col-span-1 flex flex-col items-center">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 text-center">
                    Quick Links
                  </h3>
                  <div className="w-2/4 flex justify-start">
                    <QuickLinksMenu
                      menu={header.menu}
                      primaryDomainUrl={header.shop.primaryDomain.url}
                      publicStoreDomain={publicStoreDomain}
                    />
                  </div>
                </div>
                
                {/* Social Media Section */}
                <div className="lg:col-span-1">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                    Follow Us
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Connect with us on social media.
                  </p>
                  <SocialMediaIcons />
                </div>

              </div>

              {/* Policies and Copyright Section */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                {footer?.menu && header.shop.primaryDomain?.url && (
                  <PoliciesMenu
                    menu={footer.menu}
                    primaryDomainUrl={header.shop.primaryDomain.url}
                    publicStoreDomain={publicStoreDomain}
                  />
                )}
                <p className="text-center text-sm text-gray-500 mt-6">
                  © {new Date().getFullYear()} {header.shop.name}. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    
    void (async () => {
    // TODO: Integrate with your newsletter service (e.g., Shopify Customer Account API, Mailchimp, etc.)
    // For now, this is a placeholder implementation
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Replace this with actual newsletter subscription logic
      // In production, make an API call to your newsletter service here
      
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
    })();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
          aria-label="Email address for newsletter"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? '...' : status === 'success' ? '✓' : 'Subscribe'}
        </button>
      </div>
      {status === 'success' && (
        <p className="text-xs text-green-600">Thank you for subscribing!</p>
      )}
      {status === 'error' && (
        <p className="text-xs text-red-600">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}

function SocialMediaIcons() {
  // TODO: Replace with actual social media URLs from your Shopify store settings
  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://facebook.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex gap-4">
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-purple-600 transition-colors p-2 rounded-md hover:bg-gray-50"
          aria-label={`Follow us on ${social.name}`}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
}

function QuickLinksMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: HeaderQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  const menuItems = (menu || FALLBACK_HEADER_MENU).items;

  return (
    <nav
      className="flex flex-col gap-2"
      role="navigation"
      aria-label="Quick links navigation"
    >
      {menuItems.map((item) => {
        if (!item.url) return null;

        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');

        if (isExternal) {
          return (
            <a
              href={url}
              key={item.id}
              rel="noopener noreferrer"
              target="_blank"
              className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors no-underline"
            >
              {item.title}
            </a>
          );
        }

        return (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            className={({isActive, isPending}) =>
              `text-sm font-medium transition-colors no-underline ${
                isActive
                  ? 'text-purple-600'
                  : isPending
                    ? 'text-gray-400'
                    : 'text-gray-700 hover:text-purple-600'
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

function PoliciesMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  const menuItems = (menu || FALLBACK_FOOTER_MENU).items;

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-4 mb-4"
      role="navigation"
      aria-label="Policies navigation"
    >
      {menuItems.map((item) => {
        if (!item.url) return null;

        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');

        if (isExternal) {
          return (
            <a
              href={url}
              key={item.id}
              rel="noopener noreferrer"
              target="_blank"
              className="text-xs font-medium text-gray-500 hover:text-purple-600 transition-colors no-underline"
            >
              {item.title}
            </a>
          );
        }

        return (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            className={({isActive, isPending}) =>
              `text-xs font-medium transition-colors no-underline ${
                isActive
                  ? 'text-purple-600'
                  : isPending
                    ? 'text-gray-400'
                    : 'text-gray-500 hover:text-purple-600'
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

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};
