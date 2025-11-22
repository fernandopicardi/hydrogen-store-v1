import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * COMPONENTE: CartLineItem
 * Responsável por desenhar CADA produto individual na lista.
 */
export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  // LAYOUT: 'flex gap-4' coloca imagem e texto lado a lado com respiro.
  // 'border-b' cria a linha de separação sutil entre os itens.
  return (
    <li key={id} className="flex gap-4 py-6 border-b border-gray-100 last:border-0">
      
      {/* 1. IMAGEM: shrink-0 impede que ela seja esmagada */}
      <div className="shrink-0">
        {image && (
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            height={110}
            loading="lazy"
            width={110}
            className="h-24 w-24 rounded-lg object-cover border border-gray-200 bg-gray-50"
          />
        )}
      </div>

      {/* 2. CONTEÚDO: flex-1 ocupa todo o espaço restante */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="grid gap-1">
          <div className="flex justify-between items-start">
            {/* Título com Hover Roxo */}
            <Link
              prefetch="intent"
              to={lineItemUrl}
              onClick={() => layout === 'aside' && close()}
              className="font-bold text-gray-900 hover:text-purple-600 transition-colors line-clamp-2 mr-2 no-underline"
            >
              {product.title}
            </Link>
            
            {/* Preço */}
            <div className="text-sm font-medium text-gray-900 shrink-0">
              <ProductPrice price={line?.cost?.totalAmount} />
            </div>
          </div>

          {/* Variantes (Pequenas e cinzas) */}
          <ul className="text-xs text-gray-500 space-y-1">
            {selectedOptions.map((option) => (
              <li key={option.name}>
                {option.name}: {option.value}
              </li>
            ))}
          </ul>
        </div>

        {/* 3. CONTROLES DE BAIXO (Quantidade e Remover) */}
        <div className="flex items-center justify-between mt-4">
          <CartLineQuantity line={line} />
          <CartLineRemoveButton lineIds={[id]} disabled={!!line.isOptimistic} />
        </div>
      </div>
    </li>
  );
}

/**
 * SUB-COMPONENTE: Botões de Quantidade
 * Estilizado como uma "Cápsula" (Pill) para facilitar o clique.
 */
function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center gap-3">
      {/* Label 'Qty' escondida em celulares (hidden md:inline) */}
      <small className="text-gray-400 text-xs uppercase tracking-wide hidden md:inline">Qty</small>
      
      {/* A Cápsula com Borda */}
      <div className="flex items-center border border-gray-200 rounded-md overflow-hidden h-8">
        <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            aria-label="Decrease quantity"
            disabled={quantity <= 1 || !!isOptimistic}
            name="decrease-quantity"
            value={prevQuantity}
            className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <span>&#8722;</span>
          </button>
        </CartLineUpdateButton>

        <span className="w-8 text-center text-sm font-semibold text-gray-900 border-x border-gray-100 h-full flex items-center justify-center">
          {quantity}
        </span>

        <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            aria-label="Increase quantity"
            name="increase-quantity"
            value={nextQuantity}
            disabled={!!isOptimistic}
            className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <span>&#43;</span>
          </button>
        </CartLineUpdateButton>
      </div>
    </div>
  );
}

function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button 
        type="submit" 
        disabled={disabled}
        className="text-xs font-medium text-red-500 hover:text-red-700 underline decoration-red-200 underline-offset-2 transition-colors disabled:opacity-50"
      >
        Remove
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}