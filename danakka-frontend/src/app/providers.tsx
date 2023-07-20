// app/providers.tsx
'use client'
import React, { useEffect, useState } from "react";
import { CacheProvider  } from '@chakra-ui/next-js'
import { ChakraProvider, CSSReset, Box } from '@chakra-ui/react'
import Header from '../components/Layout/Header';
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

  return (
    <CacheProvider>
      <ChakraProvider>
		<CSSReset />
		<Header />
		{isLoading ? (
			<CenterSnipper/>
		) : (
			<Box w={"100%"} p={4}>
				{children}
			</Box>
		)}

      </ChakraProvider>
    </CacheProvider>
  )
}