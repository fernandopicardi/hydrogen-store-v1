import { useLoaderData } from 'react-router';
import type { LoaderFunctionArgs } from 'react-router';
import { HeroSection } from '~/components/sections/HeroSection';
import { FeaturesSection } from '~/components/sections/FeaturesSection';
import { FeaturedProductsSection } from '~/components/sections/FeaturedProductsSection';
import { CTASection } from '~/components/sections/CTASection';
import { TestimonialsSection } from '~/components/sections/TestimonialsSection';
import { FAQSection } from '~/components/sections/FAQSection';

const HOMEPAGE_PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment HomepageProductVariant on ProductVariant {
    id
    availableForSale
    price {
      amount
      currencyCode
    }
    selectedOptions {
      name
      value
    }
  }
` as const;

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
        selectedOrFirstAvailableVariant {
          ...HomepageProductVariant
        }
      }
    }
  }
  ${HOMEPAGE_PRODUCT_VARIANT_FRAGMENT}
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

// Dados estáticos para as seções
const features = [
  {
    title: 'High Quality Products',
    description: 'We source only the finest materials to ensure your satisfaction with every purchase.',
    icon: '✨',
  },
  {
    title: 'Fast Shipping',
    description: 'Get your orders delivered quickly with our reliable shipping partners worldwide.',
    icon: '🚀',
  },
  {
    title: 'Secure Payment',
    description: 'Your transactions are protected with industry-leading security measures.',
    icon: '🔒',
  },
  {
    title: '24/7 Support',
    description: 'Our customer service team is always ready to help you with any questions.',
    icon: '💬',
  },
  {
    title: 'Easy Returns',
    description: 'Not satisfied? Return your purchase within 30 days for a full refund.',
    icon: '↩️',
  },
  {
    title: 'Eco-Friendly',
    description: 'We are committed to sustainable practices and environmentally conscious products.',
    icon: '🌱',
  },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Verified Customer',
    content: 'Amazing quality and fast shipping! I love my purchase and will definitely shop here again.',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Verified Customer',
    content: 'Great customer service and the products exceeded my expectations. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Verified Customer',
    content: 'The best shopping experience I\'ve had online. Quality products at great prices.',
    rating: 5,
  },
];

const faqs = [
  {
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy on all unused items in their original packaging. Simply contact our customer service team to initiate a return.',
  },
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping typically takes 5-7 business days. Express shipping options are available at checkout for faster delivery.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. Check our shipping page for details.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and various other payment methods depending on your location.',
  },
  {
    question: 'How can I track my order?',
    answer: 'Once your order ships, you will receive a tracking number via email. You can use this to track your package on our website or the carrier\'s site.',
  },
];

export default function Homepage() {
  const { shop, products } = useLoaderData<any>();

  const scrollToProducts = () => {
    const productsSection = document.getElementById('featured-products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <HeroSection shop={shop} onShopNowClick={scrollToProducts} />
      <FeaturesSection features={features} />
      <div id="featured-products">
        <FeaturedProductsSection products={products} />
      </div>
      <CTASection
        title="Ready to Get"
        titleHighlight="Started?"
        subtitle="Explore our collection and find the perfect products for you"
        buttonText="Shop Now"
        buttonLink="#"
        variant="primary"
        onButtonClick={scrollToProducts}
      />
      <TestimonialsSection testimonials={testimonials} />
      <FAQSection faqs={faqs} />
    </div>
  );
}