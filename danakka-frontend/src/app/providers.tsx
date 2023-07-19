// app/providers.tsx
'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, Box } from '@chakra-ui/react'
import Header from '../components/Layout/Header';

export function Providers({ 
    children 
  }: { 
  children: React.ReactNode 
  }) {
  return (
    <CacheProvider>
      <ChakraProvider>
		<Header />
		<Box w={"100%"} p={4}>
			{children}
		</Box>
        
      </ChakraProvider>
    </CacheProvider>
  )
}