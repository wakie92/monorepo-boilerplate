'use client';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { GlobalStyles } from 'src/styles/styledComponents/globalStyled';
import UiUxContextProvider from 'src/contexts/UiUxContext';

import ReactQueryProviders from '../src/components/hooks/useReactQuery';
import ThemeHandler from '../src/components/shared/ThemeHandler';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactQueryProviders>
      <UiUxContextProvider>
        <ThemeHandler>
          <>
            <GlobalStyles />
            {children}
          </>
        </ThemeHandler>
      </UiUxContextProvider>

      {process.env.NEXT_PUBLIC_APP_ENV !== 'production' && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </ReactQueryProviders>
  );
};

export { Providers };
