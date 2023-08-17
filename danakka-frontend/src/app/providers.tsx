'use client'
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, Box } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import Header from '../component/Layout/Header';
import Footer from '../component/Layout/Footer';
import LoginWrapper from '../component/Layout/LoginWrapper';
import AuthContext from '../context/AuthContext';
import CenterSnipper from "../component/Common/CenterSnipper";
import '@fontsource/noto-sans-kr/400.css'
import '@fontsource/noto-sans-kr/700.css'
import AuthManager from '../util/Authentication'; 
import { usePathname } from 'next/navigation';

export function Providers({ 
    children 
}: { 
  	children: React.ReactNode 
}) {
	const pathname = usePathname();
	const [isLoading, setIsLoading] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		setIsLoading(false);
	}, []);

	useEffect(() => {
		verifyUser();
	}, [pathname]);

	const verifyUser = async () => {
		try {
			const user = await AuthManager.verifyToken();
			if (user) {
				setIsLoggedIn(true);
			} else {
				setIsLoggedIn(false);
			}
		} catch (error) {
			setIsLoggedIn(false);
		}
	};


	const [queryClient] = useState(() => new QueryClient())

	const theme = extendTheme({
		fonts: {
		heading: `'Noto Sans KR', sans-serif`,
		body: `'Noto Sans KR', sans-serif`,
		},
	})

	return (
		<QueryClientProvider client={queryClient}>
			<CacheProvider>
				<ChakraProvider theme={theme}>
					<AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
						<Header/>
							<LoginWrapper>
							{isLoading ? (
								<CenterSnipper/>
							) : (
								<Box w={"100%"} p={4}>
									{children}
								</Box>
							)}
							</LoginWrapper>
						<Footer />
					</AuthContext.Provider>
				</ChakraProvider>
			</CacheProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>

	)
}
