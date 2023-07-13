import React from 'react';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { FiBell, FiMenu, FiSearch, FiUser } from 'react-icons/fi';

const Header = () => {
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

      {/* Search */}
      <InputGroup maxW="xs">
        <InputRightElement
          pointerEvents="none"
          children={<FiSearch color="gray.400" />}
        />
        <Input
          type="text"
          placeholder="Search..."
          rounded="md"
          _focus={{ outline: 'none' }}
        />
      </InputGroup>

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
          />

          <MenuList>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Settings</MenuItem>
            <MenuItem>Logout</MenuItem>
          </MenuList>
        </Menu>

      </HStack>
    </Flex>
  );
};

export default Header;
