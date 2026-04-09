'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function QueryProvider({ children }) {
  // Create a new QueryClient for each session but reuse it identically inside that session
  const [queryClient] = useState(
    () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          // Keep fresh data for 1 min, but refetch if stale
          staleTime: 60 * 1000,
          refetchOnWindowFocus: true
        }
      }
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>);

}