import { Link, useLoaderData } from 'react-router';
import { Image } from '@shopify/hydrogen';
import type { LoaderFunctionArgs } from 'react-router';

const HOMEPAGE_QUERY = `#graphql
  query homepage($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      name
      description
    }
    products(first: 3) {
      nodes {
        id
        title
        handle
        description
        featuredImage {
          id
          url
          altText
          width
          height
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
` as const;

export async function loader({ context }: LoaderFunctionArgs) {
  const { shop, products } = await context.storefront.query(HOMEPAGE_QUERY, {
    variables: {
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });
  return { shop, products };
}

export default function Homepage() {
  const { shop, products } = useLoaderData<any>();

  return (
    <div className="bg-gray-950 min-h-screen text-white pb-20">
      
      <div className="flex flex-col items-center gap-6 text-center max-w-2xl px-4 mx-auto py-20">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-600">
          {shop.name}
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          {shop.description || "Welcome to our custom Hydrogen Store."}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 border-b border-gray-800 pb-4">
          Our Products
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.nodes.map((product: any) => (
            <Link
              key={product.id}
              to={`/products/${product.handle}`}
              className="group bg-gray-900 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-purple-900/20 transition-all duration-300 block"
            >
              <div className="aspect-square overflow-hidden bg-gray-800 relative">
                {product.featuredImage && (
                  <Image
                    data={product.featuredImage}
                    sizes="(min-width: 45em) 30vw, 50vw"
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  />
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl text-white font-bold mb-2 group-hover:text-purple-400 transition-colors duration-300">
                  {product.title}
                </h3>
                <span className="text-xs text-white">{product.description}</span>
                <div className="text-purple-400 font-mono">
                  {product.priceRange.minVariantPrice.currencyCode} {product.priceRange.minVariantPrice.amount}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}