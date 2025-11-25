// Featured products section - customize colors via Tailwind classes
// Card bg: bg-white, borders: border-gray-200, text: text-gray-900/700/600
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { Image } from '@shopify/hydrogen';
import { AddToCartButton } from '~/components/AddToCartButton';
import { useAside } from '~/components/Aside';
import { SectionHeader } from './SectionHeader';

interface ProductVariant {
  id: string;
  availableForSale: boolean;
  price: {
    amount: string;
    currencyCode: string;
  };
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  featuredImage: {
    id: string;
    url: string;
    altText?: string | null;
    width: number;
    height: number;
  } | null;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  selectedOrFirstAvailableVariant: ProductVariant | null;
}

interface FeaturedProductsSectionProps {
  products: {
    nodes: Product[];
  };
}

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  const { open } = useAside();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [shouldCenter, setShouldCenter] = useState(false);

  useEffect(() => {
    const checkAndCenter = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const containerWidth = container.clientWidth;
        const scrollWidth = container.scrollWidth;
        
        // Se o conteúdo total cabe no container, centralizar com flexbox
        if (scrollWidth <= containerWidth) {
          setShouldCenter(true);
        } else {
          setShouldCenter(false);
          // Se não cabe, centralizar o primeiro card com scroll
          const cardWidth = 320; // w-80 = 320px
          const spacerWidth = (containerWidth - cardWidth) / 2;
          container.scrollLeft = spacerWidth;
        }
      }
    };

    // Aguardar renderização
    requestAnimationFrame(() => {
      setTimeout(checkAndCenter, 50);
      // Também verificar após resize
      window.addEventListener('resize', checkAndCenter);
    });

    return () => {
      window.removeEventListener('resize', checkAndCenter);
    };
  }, [products.nodes]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <SectionHeader
        title="Our"
        titleHighlight="Products"
        subtitle="Discover our curated collection of premium products"
      />
      
      {/* Horizontal Slider */}
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className={`overflow-x-auto scrollbar-hide flex gap-6 pb-4 ${
            shouldCenter ? 'justify-center' : ''
          }`}
          style={{ 
            scrollSnapType: shouldCenter ? 'none' : 'x mandatory',
          }}
        >
          {/* Spacer para centralizar o primeiro card (apenas quando não está centralizado) */}
          {!shouldCenter && (
            <div className="flex-shrink-0" style={{ width: 'calc((100% - 320px) / 2)' }} />
          )}
          
          {products.nodes.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => open('cart')}
            />
          ))}
          
          {/* Spacer para centralizar o último card (apenas quando não está centralizado) */}
          {!shouldCenter && (
            <div className="flex-shrink-0" style={{ width: 'calc((100% - 320px) / 2)' }} />
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: () => void }) {
  const [quantity, setQuantity] = useState(1);
  const variant = product.selectedOrFirstAvailableVariant;

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
  };

  if (!variant) return null;

  return (
    <div
      className="flex-shrink-0 w-80 bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-purple-100 transition-all duration-300"
      style={{ scrollSnapAlign: 'center' }}
    >
      <Link to={`/products/${product.handle}`} className="block">
        <div className="aspect-square overflow-hidden bg-gray-100 relative">
          {product.featuredImage && (
            <Image
              data={product.featuredImage}
              sizes="320px"
              className="object-cover w-full h-full hover:scale-110 transition-transform duration-500"
            />
          )}
        </div>
      </Link>
      
      <div className="p-6">
        <Link to={`/products/${product.handle}`}>
          <h3 className="text-xl text-gray-900 font-bold mb-2 hover:text-purple-600 transition-colors duration-300">
            {product.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
        
        <div className="text-purple-600 font-mono text-lg mb-4">
          {variant.price.currencyCode} {variant.price.amount}
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-gray-700 text-sm">Quantity:</span>
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
            <button
              type="button"
              onClick={() => handleQuantityChange(-1)}
              className="px-3 py-1 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              disabled={quantity <= 1}
            >
              −
            </button>
            <span className="px-4 py-1 text-gray-900 font-semibold min-w-[3ch] text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => handleQuantityChange(1)}
              className="px-3 py-1 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              disabled={quantity >= 10}
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <AddToCartButton
          className="w-full py-3 font-bold uppercase tracking-wide text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
          disabled={!variant.availableForSale}
          onClick={onAddToCart}
          lines={[
            {
              merchandiseId: variant.id,
              quantity,
            },
          ]}
        >
          {variant.availableForSale ? 'Add to Cart' : 'Sold Out'}
        </AddToCartButton>
      </div>
    </div>
  );
}

