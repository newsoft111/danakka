'use client'
import React, { useEffect, useState } from "react";
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


  return (
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
  )
}
