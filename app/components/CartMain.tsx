import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary'; // O Subscription agora vive DENTRO deste arquivo

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export function CartMain({layout, cart: originalCart}: CartMainProps) {
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  
  const className = `cart-main ${withDiscount ? 'with-discount' : ''} ${layout === 'aside' ? 'flex' : ''}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  // ESTRUTURA DE LAYOUT OTIMIZADA:
  // - Para 'aside': Usa flexbox vertical com scroll no conteúdo dos itens
  //   O cart-details usa flexbox para organizar itens (scrollável) + summary (fixo)
  // - Para 'page': Layout normal sem restrições de altura
  const cartDetailsClassName =
    layout === 'aside'
      ? 'flex flex-col h-full max-h-full overflow-hidden'
      : '';

  const itemsContainerClassName =
    layout === 'aside'
      ? 'flex-1 overflow-y-auto overscroll-contain min-h-0 scrollbar-hide'
      : '';

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      
      <div className={`cart-details ${cartDetailsClassName}`}>
        {/* Container scrollável para os itens do carrinho */}
        <div 
          aria-labelledby="cart-lines" 
          className={itemsContainerClassName}
        >
          <ul className={layout === 'aside' ? 'px-4 py-4' : ''}>
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>
        
        {/* Summary fixo no rodapé (apenas no layout aside) */}
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </div>
  );
}

function CartEmpty({
  hidden = false,
  layout,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();
  
  // Estilos diferentes para layout aside vs page
  const containerClassName = layout === 'aside' 
    ? 'flex flex-col items-center justify-center py-16 px-6'
    : '';
  
  return (
    <div hidden={hidden} className={containerClassName}>
      <p className="text-center text-gray-700 mb-6 text-lg">
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <Link 
        to="/collections" 
        onClick={close} 
        prefetch="viewport"
        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
      >
        Continue shopping →
      </Link>
    </div>
  );
}