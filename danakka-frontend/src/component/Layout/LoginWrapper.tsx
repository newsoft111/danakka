'use client'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import {
	useToast,
} from '@chakra-ui/react';

export default function LoginWrapper({
	children,
  }: {
	children: React.ReactNode;
  }) {
    const { isLoggedIn } = useContext(AuthContext);

	const toast = useToast();
	const currentPage = usePathname();
	const router = useRouter();


	const notPublicPages = ["auth"]; // 접근 제한이 필요한 페이지 url 
	const pageRootName = currentPage.slice(1).split("/")[0]; // 현재 페이지의 url 이름 앞부분 
	const isPublicPage = !notPublicPages.includes(pageRootName); 

	useEffect(() => {
		// 현재 페이지가 접근 제한이 필요한 페이지 && 현재 로그인된 상태가 아니라면, 
		if (!isPublicPage && !isLoggedIn) { 
			toast({
				title: '로그인이 필요합니다.',
				position: 'top',
				status: 'error',
				isClosable: true,
			})
		
			router.push("/"); // 로그인 페이지로 이동시킴.
		}
	}, [isLoggedIn, currentPage]);

  if (!isPublicPage && !isLoggedIn) {
    return <div></div>; // 위와 같은 상태일 때, 화면을 보여주지 않는다. 
  }

  return <>{children}</>; 
}
