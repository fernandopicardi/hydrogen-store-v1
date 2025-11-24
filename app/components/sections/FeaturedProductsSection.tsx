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

  useEffect(() => {
    // O scroll inicial será 0 devido ao padding e transform aplicados
    // Isso já centraliza o primeiro card
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <SectionHeader
        title="Our"
        titleHighlight="Products"
        subtitle="Discover our curated collection of premium products"
      />
      
      {/* Horizontal Slider */}
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide flex gap-6 pb-4"
        style={{ 
          scrollSnapType: 'x mandatory',
          paddingLeft: 'calc((100% - 320px) / 2)',
          paddingRight: 'calc((100% - 320px) / 2)',
        }}
      >
          {products.nodes.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => open('cart')}
            />
          ))}
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
      className="flex-shrink-0 w-80 bg-gray-900 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-purple-900/20 transition-all duration-300"
      style={{ scrollSnapAlign: 'center' }}
    >
      <Link to={`/products/${product.handle}`} className="block">
        <div className="aspect-square overflow-hidden bg-gray-800 relative">
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
          <h3 className="text-xl text-white font-bold mb-2 hover:text-purple-400 transition-colors duration-300">
            {product.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{product.description}</p>
        
        <div className="text-purple-400 font-mono text-lg mb-4">
          {variant.price.currencyCode} {variant.price.amount}
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-gray-300 text-sm">Quantity:</span>
          <div className="flex items-center gap-2 border border-gray-700 rounded-lg">
            <button
              type="button"
              onClick={() => handleQuantityChange(-1)}
              className="px-3 py-1 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
              disabled={quantity <= 1}
            >
              −
            </button>
            <span className="px-4 py-1 text-white font-semibold min-w-[3ch] text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => handleQuantityChange(1)}
              className="px-3 py-1 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
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

