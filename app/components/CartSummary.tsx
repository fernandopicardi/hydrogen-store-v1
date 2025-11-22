import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useEffect, useRef, useState} from 'react';
import {useFetcher} from 'react-router';
import type {FetcherWithComponents} from 'react-router';
// IMPORTANTE: Importando a promoção
import {CartSubscriptionPromo} from './CartSubscriptionPromo';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

/**
 * COMPONENTE: CartSummary
 * Agrupa a Promoção, os Totais e o Botão de Checkout.
 * 
 * REFATORADO COM MELHORES PRÁTICAS DE UI/UX:
 * - Hierarquia visual clara
 * - Agrupamento lógico de informações
 * - Espaçamento consistente
 * - Design limpo e moderno
 */
export function CartSummary({cart, layout}: CartSummaryProps) {
  const className =
    layout === 'page'
      ? 'cart-summary-page'
      : 'flex-shrink-0 w-full bg-white border-t border-gray-200';

  return (
    <div aria-labelledby="cart-summary" className={className}>
      {/* 1. Promoção de Assinatura */}
      <CartSubscriptionPromo hasItems={true} />

      {/* 2. Container Principal de Totais - Compacto */}
      <div className="px-4 py-3 space-y-3">
        {/* Seção de Códigos Promocionais (Descontos e Gift Cards) - Compacta */}
        <div className="space-y-1.5">
          <CartDiscounts discountCodes={cart?.discountCodes} />
          <CartGiftCard giftCardCodes={cart?.appliedGiftCards} />
        </div>

        {/* Seção de Totais - Compacta */}
        <dl className="space-y-1.5">
          {/* Subtotal */}
          <div className="flex items-center justify-between text-sm">
            <dt className="text-gray-600">Subtotal</dt>
            <dd className="font-semibold text-gray-900">
              {cart?.cost?.subtotalAmount?.amount ? (
                <Money data={cart?.cost?.subtotalAmount} />
              ) : (
                '-'
              )}
            </dd>
          </div>

          {/* Shipping */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <dt>Shipping</dt>
            <dd>Calculated at checkout</dd>
          </div>

          {/* Total Final - Destaque */}
          {(cart?.cost?.totalAmount?.amount || cart?.cost?.subtotalAmount?.amount) && (
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <dt className="text-sm font-semibold text-gray-900">
                  {cart?.cost?.totalAmount?.amount ? 'Total' : 'Estimated Total'}
                </dt>
                <dd className="text-lg font-bold text-gray-900">
                  {cart?.cost?.totalAmount?.amount ? (
                    <Money data={cart.cost.totalAmount} />
                  ) : (
                    <Money data={cart.cost.subtotalAmount!} />
                  )}
                </dd>
              </div>
            </div>
          )}
        </dl>

        {/* Botão de Checkout - CTA Principal Compacto */}
        <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
      </div>
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <a 
      href={checkoutUrl} 
      target="_self"
    >
      <span className="block w-full bg-purple-600 text-white font-bold text-center py-2.5 px-4 mt-4 rounded-lg shadow-sm hover:bg-purple-700 hover:shadow-md hover:no-underline active:scale-[0.98] transition-all duration-200 uppercase tracking-wide text-xs focus:outline-none focus:ring-2 focus:ring-purple-300 no-underline">Checkout</span>
    </a>
  );
}

/**
 * ==========================================
 * FUNÇÕES AUXILIARES ORIGINAIS
 * (Descontos e Gift Cards mantidos intactos)
 * ==========================================
 */

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  const hasAppliedCodes = codes.length > 0;

  return (
    <div className="space-y-1.5">
      {/* Códigos Aplicados - Compacto */}
      {hasAppliedCodes && (
        <div className="bg-green-50 border border-green-200 rounded-md p-2">
          <dl>
            {codes.map((code) => (
              <UpdateDiscountForm key={code} discountCodes={codes.filter(c => c !== code)}>
                <div className="flex items-center justify-between">
                  <dt className="text-xs font-medium text-green-800">Discount</dt>
                  <dd className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-green-700">{code}</span>
                    <button 
                      type="submit"
                      className="text-xs text-green-600 hover:text-green-800 underline transition-colors"
                      aria-label={`Remove discount code ${code}`}
                    >
                      Remove
                    </button>
                  </dd>
                </div>
              </UpdateDiscountForm>
            ))}
          </dl>
        </div>
      )}

      {/* Botão para Expandir/Colapsar Input - Compacto */}
      {!isExpanded && (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-purple-500 rounded"
        >
          + Discount code
        </button>
      )}

      {/* Input para Adicionar Código - Compacto quando expandido */}
      {isExpanded && (
        <UpdateDiscountForm discountCodes={codes}>
          <div className="space-y-1">
            <div className="flex gap-1.5">
              <input 
                type="text" 
                name="discountCode" 
                placeholder="Code" 
                className="flex-1 border border-gray-300 rounded-md px-2.5 py-1.5 text-xs placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                aria-label="Discount code input"
                autoFocus
              />
              <button 
                type="submit" 
                className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
              >
                Apply
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </UpdateDiscountForm>
      )}
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const appliedGiftCardCodes = useRef<string[]>([]);
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});

  useEffect(() => {
    if (giftCardAddFetcher.data) {
      giftCardCodeInput.current!.value = '';
      setIsExpanded(false);
    }
  }, [giftCardAddFetcher.data]);

  function saveAppliedCode(code: string) {
    const formattedCode = code.replace(/\s/g, '');
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
  }

  const hasAppliedCards = giftCardCodes && giftCardCodes.length > 0;

  return (
    <div className="space-y-1.5">
      {/* Gift Cards Aplicados - Compacto */}
      {hasAppliedCards && (
        <div className="bg-green-50 border border-green-200 rounded-md p-2 space-y-1.5">
          {giftCardCodes.map((giftCard) => (
            <RemoveGiftCardForm key={giftCard.id} giftCardId={giftCard.id}>
              <div className="flex items-center justify-between">
                <dt className="text-xs font-medium text-green-800">
                  Gift Card (***{giftCard.lastCharacters})
                </dt>
                <dd className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-green-700">
                    <Money data={giftCard.amountUsed} />
                  </span>
                  <button 
                    type="submit"
                    className="text-xs text-green-600 hover:text-green-800 underline transition-colors"
                    aria-label={`Remove gift card ending in ${giftCard.lastCharacters}`}
                  >
                    Remove
                  </button>
                </dd>
              </div>
            </RemoveGiftCardForm>
          ))}
        </div>
      )}

      {/* Botão para Expandir/Colapsar Input - Compacto */}
      {!isExpanded && (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="text-xs text-purple-600 hover:text-purple-700 font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-purple-500 rounded"
        >
          + Gift card
        </button>
      )}

      {/* Input para Adicionar Gift Card - Compacto quando expandido */}
      {isExpanded && (
        <UpdateGiftCardForm
          giftCardCodes={appliedGiftCardCodes.current}
          saveAppliedCode={saveAppliedCode}
          fetcherKey="gift-card-add"
        >
          <div className="space-y-1">
            <div className="flex gap-1.5">
              <input
                type="text"
                name="giftCardCode"
                placeholder="Code"
                ref={giftCardCodeInput}
                className="flex-1 border border-gray-300 rounded-md px-2.5 py-1.5 text-xs placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                aria-label="Gift card code input"
                autoFocus
              />
              <button 
                type="submit" 
                disabled={giftCardAddFetcher.state !== 'idle'} 
                className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </UpdateGiftCardForm>
      )}
    </div>
  );
}

function UpdateGiftCardForm({
  giftCardCodes,
  saveAppliedCode,
  fetcherKey,
  children,
}: {
  giftCardCodes?: string[];
  saveAppliedCode?: (code: string) => void;
  fetcherKey?: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code as string);
        }
        return children;
      }}
    </CartForm>
  );
}

function RemoveGiftCardForm({
  giftCardId,
  children,
}: {
  giftCardId: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
    </CartForm>
  );
}