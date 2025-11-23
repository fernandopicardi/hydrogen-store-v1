import {useRef, useEffect, useState, useCallback, useMemo, forwardRef} from 'react';
import {useNavigate, useFetcher} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {
  urlWithTrackingParams,
  getEmptyPredictiveSearchResult,
  type PredictiveSearchReturn,
} from '~/lib/search';
import {SEARCH_ENDPOINT} from '~/components/SearchFormPredictive';

type SearchPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

type SearchResultItem = {
  id: string;
  title: string;
  url: string;
  type: 'product' | 'collection' | 'article' | 'page';
  image?: {url: string; altText?: string | null} | null;
  price?: {amount: string; currencyCode: string} | null;
};

/**
 * Modern Search Popup Component
 * 
 * Features:
 * - Centered modal design (like Directus/Algolia)
 * - Debounced search (250ms)
 * - Keyboard navigation (arrows, Enter, ESC)
 * - Full accessibility (ARIA, roles, labels)
 * - Highlight search terms in results
 * - Smooth animations (fade + scale)
 * - Backdrop blur with dark overlay
 * - Body scroll lock when open
 */
export function SearchPopup({isOpen, onClose}: SearchPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const navigate = useNavigate();
  const fetcher = useFetcher<PredictiveSearchReturn>({key: 'search-popup'});

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 250);

  // Fetch results when debounced term changes
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      setIsDebouncing(false);
      setShowLoader(false);
      void fetcher.submit(
        {q: debouncedSearchTerm.trim(), limit: 5, predictive: true},
        {method: 'GET', action: SEARCH_ENDPOINT},
      );
    } else {
      setIsDebouncing(false);
      setShowLoader(false);
    }
  }, [debouncedSearchTerm, fetcher]);

  // Set debouncing state
  useEffect(() => {
    if (searchTerm.trim() && searchTerm !== debouncedSearchTerm) {
      setIsDebouncing(true);
    }
  }, [searchTerm, debouncedSearchTerm]);

  // Show loader only after a delay (if request is taking too long)
  useEffect(() => {
    if (fetcher.state === 'loading' && debouncedSearchTerm.trim()) {
      // Only show loader if request takes more than 300ms
      const timer = setTimeout(() => {
        if (fetcher.state === 'loading') {
          setShowLoader(true);
        }
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setShowLoader(false);
    }
  }, [fetcher.state, debouncedSearchTerm]);

  // Get search results
  const searchData = fetcher.data?.result ?? getEmptyPredictiveSearchResult();
  const {items, total} = searchData;
  const {products, collections, articles, pages} = items;

  // Flatten and format all results for navigation
  const allResults = useMemo<SearchResultItem[]>(() => {
    const results: SearchResultItem[] = [];

    products.forEach((product) => {
      results.push({
        id: product.id,
        title: product.title,
        url: urlWithTrackingParams({
          baseUrl: `/products/${product.handle}`,
          trackingParams: product.trackingParameters,
          term: debouncedSearchTerm,
        }),
        type: 'product',
        image: product?.selectedOrFirstAvailableVariant?.image
          ? {
              url: product.selectedOrFirstAvailableVariant.image.url,
              altText: product.selectedOrFirstAvailableVariant.image.altText,
            }
          : null,
        price: product?.selectedOrFirstAvailableVariant?.price
          ? {
              amount: product.selectedOrFirstAvailableVariant.price.amount,
              currencyCode:
                product.selectedOrFirstAvailableVariant.price.currencyCode,
            }
          : null,
      });
    });

    collections.forEach((collection) => {
      results.push({
        id: collection.id,
        title: collection.title,
        url: urlWithTrackingParams({
          baseUrl: `/collections/${collection.handle}`,
          trackingParams: collection.trackingParameters,
          term: debouncedSearchTerm,
        }),
        type: 'collection',
        image: collection.image
          ? {
              url: collection.image.url,
              altText: collection.image.altText,
            }
          : null,
      });
    });

    articles.forEach((article) => {
      results.push({
        id: article.id,
        title: article.title,
        url: urlWithTrackingParams({
          baseUrl: `/blogs/${article.blog.handle}/${article.handle}`,
          trackingParams: article.trackingParameters,
          term: debouncedSearchTerm,
        }),
        type: 'article',
        image: article.image
          ? {
              url: article.image.url,
              altText: article.image.altText,
            }
          : null,
      });
    });

    pages.forEach((page) => {
      results.push({
        id: page.id,
        title: page.title,
        url: urlWithTrackingParams({
          baseUrl: `/pages/${page.handle}`,
          trackingParams: page.trackingParameters,
          term: debouncedSearchTerm,
        }),
        type: 'page',
      });
    });

    return results;
  }, [products, collections, articles, pages, debouncedSearchTerm]);

  // Focus input when popup opens
  useEffect(() => {
    if (isOpen) {
      // Small delay for smooth animation
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    } else {
      // Reset state when closed
      setSearchTerm('');
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < allResults.length - 1 ? prev + 1 : prev,
        );
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        return;
      }

      if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        const selectedResult = allResults[selectedIndex];
        if (selectedResult) {
          void navigate(selectedResult.url);
          onClose();
        }
        return;
      }

      if (e.key === 'Enter' && searchTerm.trim() && selectedIndex === -1) {
        e.preventDefault();
        void navigate(`${SEARCH_ENDPOINT}?q=${encodeURIComponent(searchTerm.trim())}`);
        onClose();
        return;
      }
    },
    [allResults, selectedIndex, searchTerm, navigate, onClose],
  );

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listboxRef.current) {
      const selectedElement = listboxRef.current.querySelector(
        `#search-result-${selectedIndex}`,
      ) as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }, [selectedIndex]);

  // Reset selected index when search term changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchTerm]);

  if (!isOpen) return null;

  const hasResults = total > 0;
  const hasSearchTerm = debouncedSearchTerm.trim().length > 0;
  const isLoading = fetcher.state === 'loading';

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <div
          ref={popupRef}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ease-out scale-100 pointer-events-auto border border-gray-200"
          style={{
            animation: isOpen
              ? 'searchPopupEnter 0.3s ease-out'
              : 'searchPopupExit 0.2s ease-in',
          }}
        >
          {/* Search Input */}
          <div className="relative border-b border-gray-200 px-6 py-5">
            <div className="flex items-center gap-3">
              {/* Search Icon - Only visible when input is empty */}
              {!searchTerm && (
                <svg
                  className="w-6 h-6 text-gray-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              )}

              <input
                ref={inputRef}
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search products, collections, articles..."
                className={`flex-1 text-base bg-transparent border-0 focus:outline-none focus:ring-0 placeholder:text-gray-400 text-gray-900 ${
                  searchTerm ? 'pl-0' : 'pl-0'
                } pr-2`}
                aria-label="Search input"
                aria-autocomplete="list"
                aria-controls="search-results"
                aria-activedescendant={
                  selectedIndex >= 0
                    ? `search-result-${selectedIndex}`
                    : undefined
                }
              />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100 shrink-0"
                aria-label="Close search"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Results Container */}
          <div className="max-h-[60vh] overflow-y-auto">
            {showLoader && hasSearchTerm && !hasResults ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-gray-500">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Searching...</span>
                </div>
              </div>
            ) : !hasSearchTerm ? (
              <EmptyState />
            ) : !hasResults ? (
              <NoResultsState term={debouncedSearchTerm} />
            ) : (
              <SearchResults
                ref={listboxRef}
                items={allResults}
                searchTerm={debouncedSearchTerm}
                selectedIndex={selectedIndex}
                onItemClick={(url) => {
                  void navigate(url);
                  onClose();
                }}
                groupedResults={{
                  products,
                  collections,
                  articles,
                  pages,
                }}
              />
            )}
          </div>

          {/* Keyboard Shortcuts Hint */}
          {hasResults && (
            <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between text-xs text-gray-500 bg-gray-50 rounded-b-2xl">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs text-gray-900">
                    ↑
                  </kbd>
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs text-gray-900">
                    ↓
                  </kbd>
                  <span>to navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs text-gray-900">
                    Enter
                  </kbd>
                  <span>to select</span>
                </span>
              </div>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs text-gray-900">
                  Esc
                </kbd>
                <span>to close</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes searchPopupEnter {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  );
}

/**
 * Empty State - Shows when no search term
 */
function EmptyState() {
  return (
    <div className="text-center py-16 px-4">
      <svg
        className="w-16 h-16 mx-auto mb-4 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <p className="text-lg font-medium text-gray-500 mb-1">No recent searches</p>
      <p className="text-sm text-gray-400">Start typing to search...</p>
    </div>
  );
}

/**
 * No Results State
 */
function NoResultsState({term}: {term: string}) {
  return (
    <div className="text-center py-16 px-4">
      <p className="text-gray-500">
        No results found for <q className="font-semibold text-gray-700">{term}</q>
      </p>
    </div>
  );
}

/**
 * Search Results List
 */
const SearchResults = forwardRef<
  HTMLDivElement,
  {
    items: SearchResultItem[];
    searchTerm: string;
    selectedIndex: number;
    onItemClick: (url: string) => void;
    groupedResults: {
      products: any[];
      collections: any[];
      articles: any[];
      pages: any[];
    };
  }
>(({items, searchTerm, selectedIndex, onItemClick, groupedResults}, ref) => {
  const {products, collections, articles, pages} = groupedResults;

  // Group items by type for display
  const sections = [
    {title: 'Products', items: products, type: 'product' as const},
    {title: 'Collections', items: collections, type: 'collection' as const},
    {title: 'Articles', items: articles, type: 'article' as const},
    {title: 'Pages', items: pages, type: 'page' as const},
  ].filter((section) => section.items.length > 0);

  let globalIndex = 0;

  return (
    <div ref={ref} id="search-results" role="listbox" aria-label="Search results">
      {sections.map((section) => (
        <div key={section.type} className="bg-white">
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {section.title}
            </h3>
          </div>
          <ul className="divide-y divide-gray-100" role="group" aria-label={section.title}>
            {section.items.map((item: any) => {
              const currentIndex = globalIndex++;
              const isSelected = selectedIndex === currentIndex;
              const resultItem = items.find((r) => r.id === item.id);

              if (!resultItem) return null;

              return (
                <li
                  key={item.id}
                  id={`search-result-${currentIndex}`}
                  role="option"
                  aria-selected={isSelected}
                  className={`${
                    isSelected
                      ? 'bg-purple-50 border-l-4 border-l-purple-600'
                      : 'hover:bg-gray-50'
                  } transition-colors`}
                >
                  <SearchResultItem
                    item={resultItem}
                    searchTerm={searchTerm}
                    isSelected={isSelected}
                    onClick={() => onItemClick(resultItem.url)}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
});

SearchResults.displayName = 'SearchResults';

/**
 * Individual Search Result Item
 */
function SearchResultItem({
  item,
  searchTerm,
  isSelected,
  onClick,
}: {
  item: SearchResultItem;
  searchTerm: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
      tabIndex={-1}
    >
      {item.image && (
        <div className="shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            alt={item.image.altText ?? item.title}
            src={item.image.url}
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p
          className={`font-medium truncate ${
            isSelected ? 'text-purple-900' : 'text-gray-900'
          }`}
        >
          <HighlightText text={item.title} searchTerm={searchTerm} />
        </p>
        {item.price && (
          <p className="text-sm text-purple-600 font-semibold mt-0.5">
            <Money
              data={{
                amount: item.price.amount,
                currencyCode: item.price.currencyCode as any,
              }}
            />
          </p>
        )}
      </div>
      {isSelected && (
        <svg
          className="w-5 h-5 text-purple-600 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      )}
    </button>
  );
}

/**
 * Highlight search term in text
 */
function HighlightText({
  text,
  searchTerm,
}: {
  text: string;
  searchTerm: string;
}) {
  if (!searchTerm.trim()) return <>{text}</>;

  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  return (
    <>
      {parts.map((part, index) => {
        const isMatch = part.toLowerCase() === searchTerm.toLowerCase();
        const key = `${part}-${index}-${isMatch ? 'match' : 'text'}`;
        return isMatch ? (
          <mark
            key={key}
            className="bg-purple-100 text-purple-900 font-semibold px-0.5 rounded"
          >
            {part}
          </mark>
        ) : (
          <span key={key}>{part}</span>
        );
      })}
    </>
  );
}

/**
 * Debounce hook
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
