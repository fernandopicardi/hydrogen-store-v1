import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/policies._index';
import type {PoliciesQuery, PolicyItemFragment} from 'storefrontapi.generated';

export async function loader({context}: Route.LoaderArgs) {
  const data: PoliciesQuery = await context.storefront.query(POLICIES_QUERY);

  const shopPolicies = data.shop;
  const policies: PolicyItemFragment[] = [
    shopPolicies?.privacyPolicy,
    shopPolicies?.shippingPolicy,
    shopPolicies?.termsOfService,
    shopPolicies?.refundPolicy,
    shopPolicies?.subscriptionPolicy,
  ].filter((policy): policy is PolicyItemFragment => policy != null);

  if (!policies.length) {
    throw new Response('No policies found', {status: 404});
  }

  return {policies};
}

// Policies index page - customize colors via Tailwind classes
// Container bg: bg-white, text: text-gray-900
// Spacing: py-12 sm:py-16 for vertical, px-4 sm:px-6 lg:px-8 for horizontal
export default function Policies() {
  const {policies} = useLoaderData<typeof loader>();

  return (
    <div className="policies max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-12 leading-tight">Policies</h1>
      <div className="space-y-4 sm:space-y-6">
        {policies.map((policy) => (
          <fieldset 
            key={policy.id} 
            className="border border-gray-200 rounded-lg p-6 sm:p-8 hover:border-purple-300 hover:shadow-sm transition-all duration-200"
          >
            <Link 
              to={`/policies/${policy.handle}`}
              className="flex items-center justify-between text-purple-600 hover:text-purple-700 font-medium transition-colors no-underline group"
            >
              <span className="text-lg">{policy.title}</span>
              <svg 
                className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </fieldset>
        ))}
      </div>
    </div>
  );
}

const POLICIES_QUERY = `#graphql
  fragment PolicyItem on ShopPolicy {
    id
    title
    handle
  }
  query Policies ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      privacyPolicy {
        ...PolicyItem
      }
      shippingPolicy {
        ...PolicyItem
      }
      termsOfService {
        ...PolicyItem
      }
      refundPolicy {
        ...PolicyItem
      }
      subscriptionPolicy {
        id
        title
        handle
      }
    }
  }
` as const;
