import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary'; // O Subscription agora vive DENTRO deste arquivo
/**
 * IMAGE IMPORT - Static Asset Loading
 * 
 * HOW IT WORKS:
 * When you import an image file in a React/TypeScript project, the bundler
 * (like Vite or Webpack) processes it and returns a URL string. Think of it
 * like asking a librarian to find a book - they give you the location (URL)
 * where you can access it.
 * 
 * WHY IMPORT INSTEAD OF DIRECT PATH?
 * - The bundler optimizes the image (compression, format conversion)
 * - It generates a unique filename with hash for cache busting
 * - It validates the file exists at build time (catches errors early)
 * - TypeScript can type-check the import
 * 
 * The '~' alias points to the 'app' directory, so '~/assets' = 'app/assets'
 */
import emptyCartImage from '~/assets/empty-cart.jpg';

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

  /**
   * LAYOUT WRAPPER STRATEGY:
   * ------------------------
   * When the cart is empty, we need to center the empty state vertically.
   * The wrapper div handles this by:
   * 1. Taking full height when empty (min-h-[60vh] or h-full for aside)
   * 2. Using flexbox to center content vertically
   * 3. When cart has items, it behaves normally without height constraints
   * 
   * This is like having a picture frame that expands to fill the wall
   * when empty, but shrinks to fit content when it has items.
   */
  const wrapperClassName = !linesCount
    ? layout === 'aside'
      ? 'flex flex-col h-full min-h-full'
      : 'flex flex-col min-h-[60vh]'
    : '';

  return (
    <div className={className}>
      <div className={wrapperClassName}>
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
    </div>
  );
}

/**
 * CartEmpty Component - The Empty State UI
 * 
 * CONTEXT & ARCHITECTURE:
 * This component is like a "closed store" sign - it appears when the cart has no items.
 * It's a child component of CartMain, which acts as the "cart manager" that decides
 * whether to show the empty state or the cart items.
 * 
 * WHY THIS COMPONENT EXISTS:
 * In UX design, empty states are crucial - they're like friendly greeters that guide
 * users instead of leaving them confused. This component prevents the "dead end" feeling
 * when a cart is empty by providing clear visual feedback and a path forward.
 * 
 * COMPONENT ANATOMY:
 * - hidden prop: A boolean flag (like a light switch) that controls visibility
 * - layout prop: Optional, tells us if we're in a page or aside (modal) context
 * - useAside hook: Gets the close function (like getting the door handle to close a room)
 */
function CartEmpty({
  hidden = false,
  layout,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  /**
   * HOOK EXPLANATION: useAside()
   * 
   * Think of this like getting a remote control for a TV.
   * The useAside hook gives us access to the "close" function, which is like
   * the "power off" button for the cart aside (modal/drawer).
   * 
   * WHY WE NEED IT:
   * When the user clicks "Continue shopping" from an empty cart in the aside,
   * we want to automatically close the cart drawer - it's like closing a door
   * behind you when you leave a room. This improves UX by reducing clicks.
   */
  const {close} = useAside();

  /**
   * RETURN STATEMENT - The JSX (JavaScript XML) Output
   * 
   * JSX is like HTML but written in JavaScript. It's React's way of describing
   * what the UI should look like. Think of it as a blueprint for building a house.
   * 
   * THE STRUCTURE:
   * <div hidden={hidden}> - The outer container
   *   - hidden attribute: HTML5 native attribute (like CSS display:none)
   *   - When hidden={true}, the browser hides this element completely
   *   - This is different from CSS visibility - it removes from accessibility tree too
   * 
   * VERTICAL CENTERING STRATEGY:
   * ----------------------------
   * The parent wrapper (in CartMain) now handles the height and flex container.
   * This component just needs to:
   * 1. Take full width/height of parent (flex-1)
   * 2. Use flexbox to center its content (justify-center)
   * 3. The parent wrapper provides the height context
   * 
   * This is like a picture inside a frame - the frame (parent) sets the size,
   * and the picture (this component) centers itself within that frame.
   * 
   * LAYOUT & SPACING PHILOSOPHY:
   * ----------------------------
   * - flex-1: Takes all available space in the flex parent (fills the wrapper)
   * - flex flex-col: Vertical flex container for its children
   * - items-center: Centers children horizontally (in a column layout)
   * - justify-center: Centers children vertically (the key to vertical centering!)
   * - px-6: Horizontal padding (left/right) - prevents edge-to-edge on mobile
   * - max-w-md: Maximum width constraint - prevents image/text from being too wide
   * - mx-auto: Centers the container horizontally - like centering a picture frame
   * 
   * RESPONSIVE DESIGN:
   * The parent wrapper handles height (h-full for aside, min-h-[60vh] for page),
   * so this component just focuses on centering its content within that space.
   */
  return (
    <div
      hidden={hidden}
      className="flex-1 flex flex-col items-center justify-center px-6 max-w-md mx-auto w-full"
    >
      {/* 
        EMPTY STATE IMAGE - The Visual Storyteller
        ============================================
        
        WHY USE AN IMAGE FILE INSTEAD OF SVG?
        ---------------------------------------
        1. Professional Design: Pre-designed illustrations are often more polished
           than custom SVGs - like hiring a professional photographer vs taking
           a phone selfie
        2. Consistent Branding: Using a curated image ensures visual consistency
           across the application
        3. Time Efficiency: No need to design/code custom graphics
        4. Rich Details: Raster images can include subtle gradients, shadows,
           and textures that are complex to recreate in SVG
        
        IMAGE ELEMENT ANATOMY:
        ----------------------
        - src={emptyCartImage}: Uses the imported image URL (the bundler processed it)
        - alt: Critical for accessibility - screen readers announce this text
          Think of it like a caption for visually impaired users
        - className: Tailwind utility classes for responsive sizing
          * "w-full" = 100% width of parent (responsive)
          * "max-w-xs" = Maximum width of 20rem (320px) - prevents oversized image
          * "h-auto" = Height adjusts automatically (maintains aspect ratio)
          * "mb-8" = Margin bottom of 2rem - creates space between image and text
          * "object-contain" = Scales image to fit while maintaining aspect ratio
            (like fitting a photo in a frame without cropping)
        
        LOADING STRATEGY:
        -----------------
        The image is loaded normally (no lazy loading) because:
        - Empty state is above the fold (visible immediately)
        - It's a small, optimized image
        - User needs to see it right away for context
      */}
      <img
        src={emptyCartImage}
        alt="Empty shopping cart illustration - Your cart is waiting for items"
        className="w-full max-w-xs h-auto mb-8 object-contain"
      />

      {/* 
        TEXT CONTENT - The Verbal Guide
        ================================
        
        WHY &rsquo; INSTEAD OF APOSTROPHE?
        -----------------------------------
        &rsquo; is an HTML entity for a right single quotation mark (')
        It's more typographically correct than a straight apostrophe.
        Think of it like using proper punctuation in formal writing.
        
        TYPOGRAPHY & SPACING:
        ---------------------
        - "text-center" = Centers the text horizontally (like centering text in a document)
        - "text-gray-700" = Darker gray for better readability (WCAG contrast standards)
        - "mb-6" = Margin bottom of 1.5rem - creates space before the CTA button
        - "text-lg" = Larger text size (1.125rem) - improves readability
        - "leading-relaxed" = Line height of 1.625 - makes text easier to read
          (like double-spacing in a document for easier reading)
        - "max-w-sm" = Constrains text width for optimal reading line length
          (research shows 45-75 characters per line is ideal for readability)
      */}
      <p className="text-center text-gray-700 mb-6 text-lg leading-relaxed max-w-sm">
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>

      {/* 
        CALL-TO-ACTION LINK - The Path Forward
        =======================================
        
        WHY Link FROM react-router INSTEAD OF <a> TAG?
        -------------------------------------------------
        - Link does client-side navigation (faster, no full page reload)
        - It's like taking an elevator vs climbing stairs - smoother experience
        - Prefetch="viewport" means: "load this page in background when link is visible"
          This is like pre-heating an oven before you need it - smart optimization!
        
        EVENT HANDLER: onClick={close}
        ------------------------------
        This is a function reference (not a function call - notice no parentheses).
        When the user clicks, React calls this function. It's like setting up
        an alarm clock - you configure it now, it goes off later.
        
        BUTTON STYLING & UX BEST PRACTICES:
        -----------------------------------
        - "inline-flex" = Makes it a flex container (for aligning icon + text)
        - "items-center" = Vertically centers items (like aligning text in a line)
        - "gap-2" = Space between icon and text (0.5rem) - visual breathing room
        - "font-medium" = Medium font weight (500) - makes it stand out as clickable
        - "text-purple-600" = Purple color (matches your brand theme)
        - "hover:text-purple-700" = Darker purple on hover (visual feedback)
        - "hover:underline" = Underline on hover (additional visual cue)
        - "transition-all" = Smooth transitions for all properties (color, underline)
        - "duration-200" = Quick animation (200ms) - feels snappy and responsive
        - "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2" =
          Accessibility: Keyboard navigation support with visible focus ring
          (like highlighting a button when you tab to it)
        - "rounded-md" = Slightly rounded corners (modern, friendly appearance)
        - "px-4 py-2" = Padding inside button (comfortable click target size)
      */}
      <Link
        to="/collections"
        onClick={close}
        prefetch="viewport"
        className="inline-flex items-center gap-0 hover:no-underline"
      >
        {/* 
          ICON SVG - The Visual Cue for "Go Back"
          -----------------------------------------
          This arrow icon provides visual context - it points left, suggesting
          "go back to shopping". Icons are like road signs - they communicate
          quickly without words.
          
          viewBox="0 0 24 24" = standard icon coordinate system
          stroke="currentColor" = uses parent's text color (adaptive coloring)
        */}
        <svg
          className="w-4 h-4 "
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        <span className="inline-flex items-center gap-2 font-medium no-underline  hover:text-purple-700 hover:no-underline transition-all duration-0 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-md px-4 py-2">
          Continue shopping</span>
      </Link>
    </div>
  );
}