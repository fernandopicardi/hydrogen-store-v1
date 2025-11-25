// Paginated resource section - customize colors via Tailwind classes
// Navigation links: text-purple-600 hover:text-purple-700
import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

/**
 * <PaginatedResourceSection > is a component that encapsulate how the previous and next behaviors throughout your application.
 */
export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  resourcesClassName,
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'];
  children: React.FunctionComponent<{node: NodesType; index: number}>;
  resourcesClassName?: string;
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div>
            <PreviousLink>
              {isLoading ? (
                <span className="text-gray-500">Loading...</span>
              ) : (
                <span className="text-purple-600 hover:text-purple-700 font-medium transition-colors cursor-pointer">
                  ↑ Load previous
                </span>
              )}
            </PreviousLink>
            {resourcesClassName ? (
              <div className={resourcesClassName}>{resourcesMarkup}</div>
            ) : (
              resourcesMarkup
            )}
            <NextLink>
              {isLoading ? (
                <span className="text-gray-500">Loading...</span>
              ) : (
                <span className="text-purple-600 hover:text-purple-700 font-medium transition-colors cursor-pointer">
                  Load more ↓
                </span>
              )}
            </NextLink>
          </div>
        );
      }}
    </Pagination>
  );
}
