import {Link} from 'react-router';

/**
 * COMPONENT: CartSubscriptionPromo
 * --------------------------------
 * This component renders a promotional box above the cart totals.
 * Ideally used to upsell a subscription plan (Selling Plans).
 * * UX Strategy:
 * It highlights the benefits (Savings, Free Shipping) right before
 * the user proceeds to checkout.
 */
export function CartSubscriptionPromo({hasItems}: {hasItems: boolean}) {
  if (!hasItems) return null;

  return (
    <div className="mt-4">
      {/* Container Box with specific styling to stand out */}
      <div className="border border-purple-200 bg-white rounded-xl p-4 shadow-sm relative overflow-hidden">
        
        {/* Decorative background element (Purple glow) */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-100 rounded-full opacity-50 blur-xl pointer-events-none"></div>

        {/* Header Section */}
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Recommended
            </span>
            <h3 className="text-sm font-bold text-gray-900">
              Upgrade to Subscription
            </h3>
          </div>
          {/* Mock Savings Display */}
          <span className="text-purple-700 font-bold text-sm">
            Save $12.00
          </span>
        </div>

        {/* Benefits List */}
        <ul className="space-y-2 mb-4">
          <BenefitItem text="10% OFF on this order" />
          <BenefitItem text="Free Shipping included" />
          <BenefitItem text="Cancel or skip anytime" />
        </ul>

        {/* Action Button (Toggle Simulation) */}
        <button className="w-full py-2 px-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 group">
          <span className="w-4 h-4 border-2 border-purple-600 rounded-full flex items-center justify-center">
             <span className="w-2 h-2 bg-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </span>
          Switch to Subscription
        </button>
      </div>
    </div>
  );
}

// Helper sub-component for list items
function BenefitItem({text}: {text: string}) {
  return (
    <li className="flex items-center gap-2 text-xs text-gray-600">
      {/* Checkmark Icon SVG */}
      <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      {text}
    </li>
  );
}