// Product item component - customize colors via Tailwind classes
// Text: text-gray-900/700, hover: hover:text-purple-600
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  return (
    <Link
      className="product-item group"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {image && (
        <Image
          alt={image.altText || product.title}
          aspectRatio="1/1"
          data={image}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
          className="rounded-lg border border-gray-200 bg-gray-50"
        />
      )}
      <h4 className="text-gray-900 font-semibold mt-3 mb-1 group-hover:text-purple-600 transition-colors">
        {product.title}
      </h4>
      <small className="text-gray-700 font-medium">
        <Money data={product.priceRange.minVariantPrice} />
      </small>
    </Link>
  );
}
