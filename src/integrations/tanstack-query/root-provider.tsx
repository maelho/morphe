import { QueryClient } from "@tanstack/react-query"

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 2, // 2 minutes
      },
    },
  })

  return {
    queryClient,
  }
}
