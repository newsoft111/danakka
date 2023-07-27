"use client"
import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Link,
  useColorMode,
  useToast
} from '@chakra-ui/react';
import { FiBell, FiMenu, FiMoon, FiSun, FiUser } from 'react-icons/fi';
import LoginModal from '../Authentication/LoginModal';
import JoinModal from '../Authentication/JoinModal';
import { VerifyToken, Logout } from '../../util/Authentication'; // verifyToken 함수 임포트
import NextLink from 'next/link';



const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toggleColorMode, colorMode } = useColorMode();


  const toast = useToast()

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsJoinModalOpen(false);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openJoinModal = () => {
    setIsLoginModalOpen(false);
    setIsJoinModalOpen(true);
  };

  const closeJoinModal = () => {
    setIsJoinModalOpen(false);
  };

  const handleLoginSuccess = () => {
    closeLoginModal(); // 로그인 모달 닫기
  };

  useEffect(() => {
    (async () => {
      try {
        const user = await VerifyToken();
        setIsLoggedIn(!!user);
		toast({
			title: `로그인 성공!`,
			position: 'top',
			status: 'success',
			isClosable: true,
		})
      } catch (error) {
        setIsLoggedIn(false);
		toast({
			title: `로그인 실패!`,
			position: 'top',
			status: 'success',
			isClosable: true,
		})
      }
    })();
  }, []);



  return (
	<>
		<Flex
			as="header"
			align="center"
			justify="space-between"
			px={4}
			py={2}
			boxShadow="md"
			>


			{/* Logo */}
			<Box>
				<Link as={NextLink} href='/'>
					<Image src="/path/to/logo.png" alt="Logo" h={6} />
				</Link>
			</Box>

			{/* User */}
			<HStack spacing={4}>
				<IconButton
					aria-label="toggle theme"
					variant="ghost"
					colorScheme="gray"
					onClick={toggleColorMode}
					icon={colorMode === "dark" ? <FiSun /> : <FiMoon />}
				/>

				<IconButton
				aria-label="Notifications"
				variant="ghost"
				colorScheme="gray"
				icon={<FiBell />}
				/>

				{/* User Profile */}
				{isLoggedIn ? (
				<Menu>
					<MenuButton
					as={IconButton}
					aria-label="User"
					variant="ghost"
					colorScheme="gray"
					icon={<FiUser />}
					/>
					<MenuList>
						<MenuItem as={NextLink} href='/mypage'>대시보드</MenuItem>
						<MenuItem as={NextLink} href='/mypage/profile'>내프로필</MenuItem>
						<MenuItem as={NextLink} href='/mypage/security'>보안설정</MenuItem>
						<MenuDivider />
						<MenuItem as={NextLink} href='/mypage/ticket'>티켓 : 100장</MenuItem>
						<MenuDivider />
						<MenuItem onClick={Logout}>로그아웃</MenuItem>
							
					</MenuList>
				</Menu>
				) : (
				<Menu>
					<MenuButton
					as={IconButton}
					aria-label="User"
					variant="ghost"
					colorScheme="gray"
					icon={<FiUser />}
					onClick={openLoginModal}
					/>
				</Menu>
				)}
			</HStack>

			<LoginModal
				isOpen={isLoginModalOpen}
				onClose={closeLoginModal}
				openJoinModal={openJoinModal}
				onLoginSuccess={handleLoginSuccess} // 로그인 성공시 호출되는 핸들러 추가
			/>
			<JoinModal isOpen={isJoinModalOpen} onClose={closeJoinModal} openLoginModal={openLoginModal} />
		</Flex>
		
	</>
    
  );
};

export default Header;
