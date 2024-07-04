// components/providers/ReactQueryClientProvider.tsx

'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export const ReactQueryClientProvider = ({ children }: { children: React.ReactNode }) => {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						// With SSR, we usually want to set some default staleTime
						// above 0 to avoid refetching immediately on the client
						// 1분 동안 같은 쿼리 다시 요청할 때 캐시된 데이터 이용
						staleTime: 60 * 1000,
					},
				},
			})
	)
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}