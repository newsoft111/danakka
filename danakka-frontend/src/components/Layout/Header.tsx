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
} from '@chakra-ui/react';
import { FiBell, FiMenu, FiUser } from 'react-icons/fi';
import LoginModal from '../Authentication/LoginModal';
import JoinModal from '../Authentication/JoinModal';
import { verifyToken, Logout } from '../../util/Authentication'; // verifyToken 함수 임포트


const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태에 따른 변수 (초기값은 false로 설정)

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
    setIsLoggedIn(true); // 로그인 성공시 isLoggedIn을 true로 설정
    closeLoginModal(); // 로그인 모달 닫기
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await verifyToken();
        setIsLoggedIn(!!user); // user 값이 존재하면 true, 그렇지 않으면 false로 isLoggedIn 설정
      } catch (error) {
        setIsLoggedIn(false); // 토큰 검증 실패 시 isLoggedIn을 false로 설정
        console.log('토큰 검증에 실패했습니다.', error);
      }
    };

    fetchUser();
  }, []);


  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      px={4}
      py={2}
      bg="white"
      boxShadow="md"
    >


      {/* Logo */}
      <Box>
        <Image src="/path/to/logo.png" alt="Logo" h={6} />
      </Box>

      {/* User */}
      <HStack spacing={4}>
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
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem onClick={Logout}>Logout</MenuItem>
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
  );
};

export default Header;
