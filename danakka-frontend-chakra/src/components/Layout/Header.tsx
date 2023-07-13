import { useState } from 'react';
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


const Header = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

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
      {/* Mobile Menu Button */}
      <IconButton
        aria-label="Menu"
        variant="ghost"
        colorScheme="gray"
        icon={<FiMenu />}
        display={{ base: 'block', md: 'none' }}
      />

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
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="User"
            variant="ghost"
            colorScheme="gray"
            icon={<FiUser />}
			onClick={openLoginModal}
          />

		  

          <MenuList>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Settings</MenuItem>
            <MenuItem>Logout</MenuItem>
          </MenuList>
        </Menu>

      </HStack>
	  <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} openJoinModal={openJoinModal} />
	  <JoinModal isOpen={isJoinModalOpen} onClose={closeJoinModal} openLoginModal={openLoginModal}/>
    </Flex>
  );
};

export default Header;
