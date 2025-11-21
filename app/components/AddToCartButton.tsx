import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  className,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => {
        const isLoading = fetcher.state === 'submitting';
        const isDisabled = disabled ?? isLoading;
        return (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            <button
              type="submit"
              onClick={onClick}
              disabled={isDisabled}
              className={`${className ?? ''} ${isLoading ? 'opacity-80 cursor-not-allowed' : ''} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Adding to cart...' : children}
            </button>
          </>
        );
      }}
    </CartForm>
  );
}
