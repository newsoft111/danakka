import React, { useEffect, useState } from "react";
import { ChakraProvider,Box } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import CenterSnipper from "../components/Common/CenterSnipper";
import usePreserveScroll from '../util/PreserveScroll'

export default function MyApp({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  usePreserveScroll();

  return (
    <ChakraProvider>
      <Header />
        <Box w={"100%"} p={4}>
          <Component {...pageProps} />
        </Box>
      <Footer />
    </ChakraProvider>
  )
}

