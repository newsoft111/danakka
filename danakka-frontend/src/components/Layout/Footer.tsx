import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

const Navbar: React.FC = () => {
  return (
    <Box bg="blue.500" py={4} px={8} color="white">
      <Flex justify="space-between" align="center">
        <Text fontSize="xl" fontWeight="bold">
          My App
        </Text>
        <Text fontSize="md" fontWeight="bold">
          Real-time Reservations
        </Text>
      </Flex>
    </Box>
  );
};

export default Navbar;
