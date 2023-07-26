'use client'
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, Box } from '@chakra-ui/react'
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import CenterSnipper from "../components/Common/CenterSnipper";


export function Providers({ 
    children 
  }: { 
  children: React.ReactNode 
  }) {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const [queryClient] = useState(() => new QueryClient())

  return (
	<QueryClientProvider client={queryClient}>
		<CacheProvider>
		<ChakraProvider>
			<Header />
			{isLoading ? (
			<CenterSnipper/>
			) : (
			<Box w={"100%"} p={4}>
				{children}
			</Box>
			)}
			<Footer />

			

		</ChakraProvider>
		</CacheProvider>
		<ReactQueryDevtools initialIsOpen={false} />
	</QueryClientProvider>

  )
}
